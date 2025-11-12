import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import useAxios from "../hooks/useAxios";
import { AuthContext } from "../context/AuthProvider";
import { FaSave } from "react-icons/fa";
import LoadingSpinner from "../components/LoadingSpinner";

const AddBook = () => {
  const { user } = useContext(AuthContext);
  const apiAxios = useAxios();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    "Fantasy",
    "Fiction",
    "Sci-Fi",
    "Thriller",
    "Romance",
    "Mystery",
    "Horror",
    "Historical",
    "Biography",
    "Children",
  ];

  const uploadImageToImgBB = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    const imgbbKey = import.meta.env.VITE_IMGBB_KEY;

    if (!imgbbKey) throw new Error("ImgBB API key is missing.");
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (data.success) return data.data.url;
    throw new Error(data.error.message || "Image upload failed.");
  };

  const onSubmit = async (data) => {
    if (!user) {
      toast.error("You must be logged in to add a book.");
      return;
    }

    setIsSubmitting(true);
    try {
      const coverImageUrl = await toast.promise(
        uploadImageToImgBB(data.coverImage[0]),
        {
          loading: "Uploading cover image...",
          success: "Image uploaded successfully!",
          error: (err) => `Image upload failed: ${err.message}`,
        }
      );

      const bookData = {
        title: data.title,
        author: data.author,
        category: data.genre,
        description: data.summary,
        imageUrl: coverImageUrl,
        price: parseFloat(data.price),
        rating: parseFloat(data.rating),
        userName: user.displayName || user.email,
        userId: user.uid,
      };

      const res = await apiAxios.post("/books", bookData);
      toast.success("Book added successfully!");
      reset();
      navigate(`/book/${res.data._id}`);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || error.message || "Failed to add book."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-base-100 rounded-2xl shadow-2xl border border-primary/20 mt-10 mb-20">
      <h1 className="text-3xl font-extrabold text-center text-primary mb-2">
        📖 Add a New Book
      </h1>
      <p className="text-center text-base-content/70 mb-8">
        Fill out the details below to add a book to the collection.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label">
              <span className="label-text font-semibold">Title*</span>
            </label>
            <input
              type="text"
              placeholder="The Great Gatsby"
              className="input input-bordered w-full"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <span className="text-error text-sm">{errors.title.message}</span>
            )}
          </div>

          <div>
            <label className="label">
              <span className="label-text font-semibold">Author*</span>
            </label>
            <input
              type="text"
              placeholder="F. Scott Fitzgerald"
              className="input input-bordered w-full"
              {...register("author", { required: "Author is required" })}
            />
            {errors.author && (
              <span className="text-error text-sm">{errors.author.message}</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label">
              <span className="label-text font-semibold">Genre/Category*</span>
            </label>
            <select
              className="select select-bordered w-full"
              defaultValue=""
              {...register("genre", { required: "Genre is required" })}
            >
              <option value="" disabled>
                Select a Genre
              </option>
              {categories.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
            {errors.genre && (
              <span className="text-error text-sm">{errors.genre.message}</span>
            )}
          </div>

          <div>
            <label className="label">
              <span className="label-text font-semibold">Rating (1-5)*</span>
            </label>
            <input
              type="number"
              step="0.1"
              min="1"
              max="5"
              placeholder="4.5"
              className="input input-bordered w-full"
              {...register("rating", {
                required: "Rating is required",
                valueAsNumber: true,
                min: { value: 1, message: "Min rating is 1" },
                max: { value: 5, message: "Max rating is 5" },
              })}
            />
            {errors.rating && (
              <span className="text-error text-sm">{errors.rating.message}</span>
            )}
          </div>
        </div>

        <div>
          <label className="label">
            <span className="label-text font-semibold">Price*</span>
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="12.99"
            className="input input-bordered w-full"
            {...register("price", {
              required: "Price is required",
              valueAsNumber: true,
              min: { value: 0, message: "Price cannot be negative" },
            })}
          />
          {errors.price && (
            <span className="text-error text-sm">{errors.price.message}</span>
          )}
        </div>

        <div>
          <label className="label">
            <span className="label-text font-semibold">
              Cover Image* (Upload to ImgBB)
            </span>
          </label>
          <input
            type="file"
            className="file-input file-input-bordered file-input-primary w-full"
            accept="image/*"
            {...register("coverImage", {
              required: "Cover image is required",
              validate: (value) => value.length > 0 || "Cover image is required",
            })}
          />
          {errors.coverImage && (
            <span className="text-error text-sm">{errors.coverImage.message}</span>
          )}
        </div>

        <div>
          <label className="label">
            <span className="label-text font-semibold">Summary/Description*</span>
          </label>
          <textarea
            className="textarea textarea-bordered h-32 w-full"
            placeholder="A brief summary of the book..."
            {...register("summary", { required: "Summary is required" })}
          ></textarea>
          {errors.summary && (
            <span className="text-error text-sm">{errors.summary.message}</span>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full flex items-center justify-center gap-2"
          disabled={isSubmitting}
        >
          <FaSave /> {isSubmitting ? "Adding Book..." : "Add Book"}
        </button>
      </form>

      {isSubmitting && <LoadingSpinner />}
    </div>
  );
};

export default AddBook;
