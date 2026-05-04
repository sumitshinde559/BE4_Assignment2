const express = require("express");

const app = express();

app.use(express.json());

const { initializeDatabase } = require("./db/db.connect");
const fs = require("fs");
const Recipe = require("./models/recipe.models");

initializeDatabase();
//3. Create an API with route "/recipes" to create a new recipe in the recipes database. Make sure to handle errors properly. Test your API with Postman. Add the following recipe:

const newRecipe = {
  title: "Spaghetti Carbonara",
  author: "Sanjeev Kapoor",
  difficulty: "Intermediate",
  prepTime: 20,
  cookTime: 15,
  ingredients: [
    "200g spaghetti",
    "100g guanciale or pancetta, diced",
    "2 large eggs",
    "50g grated Pecorino Romano cheese",
    "Salt and black pepper to taste",
  ],
  instructions: [
    "Cook the spaghetti in boiling salted water until al dente.",
    "Meanwhile, sauté the guanciale or pancetta until crispy.",
    "In a bowl, whisk together eggs and grated cheese.",
    "Drain the spaghetti and immediately toss with the egg mixture and cooked guanciale/pancetta.",
    "Season with salt and pepper. Serve immediately.",
  ],
  imageUrl: "https://example.com/spaghetti_carbonara.jpg",
};

async function createNewRecipe(newRecipe) {
  try {
    const recipe = new Recipe(newRecipe);
    const savedRecipe = await recipe.save();
    console.log(savedRecipe);
    return savedRecipe;
  } catch (error) {
    console.log("Error in creating new recipe.");
  }
}

//createNewRecipe(newRecipe);

app.post("/recipes", async (req, res) => {
  try {
    const savedRecipe = await createNewRecipe(req.body);
    if (savedRecipe) {
      res
        .status(201)
        .json({ message: "Recipe created successfully.", recipe: savedRecipe });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to create new recipe." });
  }
});

//6. Create an API to get all the recipes in the database as a response. Make sure to handle errors properly.

async function readAllRecipes() {
  try {
    const allRecipes = await Recipe.find();
    if (allRecipes.length != 0) {
      console.log("All Recipes: ", allRecipes);
      return allRecipes;
    }
  } catch (error) {
    console.log("Error in reading recipes.");
  }
}

//readAllRecipes();

app.get("/recipes", async (req, res) => {
  try {
    const allRecipes = await readAllRecipes();
    if (allRecipes.length != 0) {
      res.status(200).json({
        message: "All recipes loaded successfully. ",
        recipes: allRecipes,
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to read recipes." });
  }
});

//7. Create an API to get a recipe's details by its title. Make sure to handle errors properly.

async function getRecipeByTitle(recipeTitle) {
  try {
    const recipeByTitle = await Recipe.findOne({ title: recipeTitle });
    if (recipeByTitle) {
      console.log("Recipe found. >", recipeByTitle);
      return recipeByTitle;
    } else {
      console.log("No recipe found.", error);
    }
  } catch (error) {
    console.log("Failed to find a recipe.", error);
  }
}

//getRecipeByTitle("Chicken Tikka Masala");

app.get("/recipes/title/:recipeTitle", async (req, res) => {
  try {
    const recipeByTitle = await getRecipeByTitle(req.params.recipeTitle);
    if (recipeByTitle) {
      res.status(200).json({
        message: "Recipe loaded successfully.",
        recipeByTitle: recipeByTitle,
      });
    } else {
      res.status(404).json({ error: "Recipe not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to read recipe.", error });
  }
});

//8. Create an API to get details of all the recipes by an author. Make sure to handle errors properly.

async function getRecipesByAuthor(authorName) {
  try {
    const recipesByAuthor = await Recipe.find({ author: authorName });
    if (recipesByAuthor.length != 0) {
      console.log("All recipes by author: ", recipesByAuthor);
      return recipesByAuthor;
    } else {
      console.log("No recipes found.");
    }
  } catch (error) {
    console.log("Failed to load recipes.", error);
  }
}

//getRecipesByAuthor("Sanjeev Kapoor");

app.get("/recipes/author/:authorName", async (req, res) => {
  try {
    const recipesByAuthor = await getRecipesByAuthor(req.params.authorName);
    if (recipesByAuthor.length != 0) {
      res.status(200).json({
        message: "All recipes by author loaded successfully.",
        recipesByAuthor: recipesByAuthor,
      });
    } else {
      res.status(404).json({ error: "No recipes found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to load recipes." });
  }
});

//9.Create an API to get all the recipes that are of "Easy" difficulty level.

async function getRecipesByDifficultyLevel(difficultyLevel) {
  try {
    const recipesByDifficultyLevel = await Recipe.find({
      difficulty: difficultyLevel,
    });
    if (recipesByDifficultyLevel.length != 0) {
      console.log("All recipes by difficulty level:", recipesByDifficultyLevel);
      return recipesByDifficultyLevel;
    } else {
      console.log("No recipes found.");
    }
  } catch (error) {
    console.log("Failed to load recipes.");
  }
}

//getRecipesByDifficultyLevel("Easy");

app.get("/recipes/difficulty/:difficultyLevel", async (req, res) => {
  try {
    const recipesByDifficultyLevel = await getRecipesByDifficultyLevel(
      req.params.difficultyLevel,
    );
    if (recipesByDifficultyLevel.length != 0) {
      res.status(200).json({
        message: "All recipes loaded successfully.",
        recipes: recipesByDifficultyLevel,
      });
    } else {
      res.status(404).json({ error: "No recipes found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to load recipe." });
  }
});

//10. Create an API to update a recipe's difficulty level with the help of its id. Update the difficulty of "Spaghetti Carbonara" from "Intermediate" to "Easy". Send an error message "Recipe not found" if the recipe is not found. Make sure to handle errors properly. { difficulty: "Easy" }

async function updateRecipeById(recipeId, dataToUpdate) {
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      recipeId,
      dataToUpdate,
      { returnDocument: "after" },
    );

    if (updatedRecipe) {
      console.log("Recipe updated successfully.", updatedRecipe);
      return updatedRecipe;
    } else {
      console.log("Recipe not found.");
    }
  } catch (error) {
    console.log("Failed to update recipe.", error);
  }
}
//updateRecipeById("69f844c1e9ae0bfcc97f87f8", { difficulty: "Easy" });

app.post("/recipes/:recipeId", async (req, res) => {
  try {
    const updatedRecipe = await updateRecipeById(req.params.recipeId, req.body);
    if (updatedRecipe) {
      res.status(200).json({
        message: "Recipe updated successfully.",
        updatedRecipe: updatedRecipe,
      });
    } else {
      res.status(404).json({ error: "No recipe found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to load recipe." });
  }
});

//11. Create an API to update a recipe's prep time and cook time with the help of its title. Update the details of the recipe "Chicken Tikka Masala". Send an error message "Recipe not found" if the recipe is not found. Make sure to handle errors properly. Updated recipe data: { "prepTime": 40, "cookTime": 45 }

async function updateRecipeByTitle(recipeTitle, dataToUpdate) {
  try {
    const updatedRecipe = await Recipe.findOneAndUpdate(
      { title: recipeTitle },
      dataToUpdate,
      { returnDocument: "after" },
    );
    if (updatedRecipe) {
      console.log("Recipe updated successfully.", updatedRecipe);
      return updatedRecipe;
    } else {
      console.log("Recipe not found.");
    }
  } catch (error) {
    console.log("Failed to update recipe.", error);
  }
}

//updateRecipeByTitle("Chicken Tikka Masala", { prepTime: 40, cookTime: 45 });

app.post("/recipes/title/:recipeTitle", async (req, res) => {
  try {
    const updatedRecipe = await updateRecipeByTitle(
      req.params.recipeTitle,
      req.body,
    );
    if (updatedRecipe) {
      res.status(200).json({
        message: "Recipe updated successfully.",
        updatedRecipe: updatedRecipe,
      });
    } else {
      res.status(404).json({ error: "No recipe found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to load recipe." });
  }
});

//12. Create an API to delete a recipe with the help of a recipe id. Send an error message "Recipe not found" if the recipe does not exist. Make sure to handle errors properly.

async function deleteRecipeById(recipeId) {
  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(recipeId);
    if (deletedRecipe) {
      console.log("Recipe deleted successfully.", deletedRecipe);
    } else {
      res.status(404).json({ error: "Recipe not found." });
    }
  } catch (error) {
    console.log("Failed to delete recipe.", error);
  }
}

//deleteRecipeById("69f8a078fc85ed72eba2142c");

app.delete("/recipes/:recipeId", async (req, res) => {
  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(req.params.recipeId);
    if (deletedRecipe) {
      res.status(200).json({
        message: "Recipe deleted successfully.",
        deletedRecipe: deletedRecipe,
      });
    } else {
      res.status(404).json({ error: "No recipe found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to load recipe.", error });
  }
});

//PORT Assignment
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

/*

const express = require("express");

const app = express();

app.use(express.json());

const { initializeDatabase } = require("./db/db.connect");
const fs = require("fs");
const Recipe = require("./models/recipe.models");

initializeDatabase();

//3. Create an API with route "/recipes" to create a new recipe in the recipes database. Make sure to handle errors properly. Test your API with Postman. Add the following recipe:

const newRecipe = {
  title: "Spaghetti Carbonara",
  author: "Sanjeev Kapoor",
  difficulty: "Intermediate",
  prepTime: 20,
  cookTime: 15,
  ingredients: [
    "200g spaghetti",
    "100g guanciale or pancetta, diced",
    "2 large eggs",
    "50g grated Pecorino Romano cheese",
    "Salt and black pepper to taste",
  ],
  instructions: [
    "Cook the spaghetti in boiling salted water until al dente.",
    "Meanwhile, sauté the guanciale or pancetta until crispy.",
    "In a bowl, whisk together eggs and grated cheese.",
    "Drain the spaghetti and immediately toss with the egg mixture and cooked guanciale/pancetta.",
    "Season with salt and pepper. Serve immediately.",
  ],
  imageUrl: "https://example.com/spaghetti_carbonara.jpg",
};

async function createNewRecipe(newRecipe) {
  try {
  } catch (error) {
    console.log("Error in creating new recipe.");
  }
}

async function createNewBook(newBook) {
  try {
    const book = new Book(newBook);
    const savedBook = await book.save();
    console.log(savedBook);
    return savedBook;
  } catch (error) {
    console.log(error);
  }
}

//createNewBook(newBook);

app.post("/books", async (req, res) => {
  try {
    const savedBook = await createNewBook(req.body);
    if (savedBook) {
      res
        .status(201)
        .json({ message: "Book added successfully.", savedBook: savedBook });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to add book." });
  }
});

//2. Run your API and create another book data in the db.

const newBook2 = {
  title: "Shoe Dog",
  author: "Phil Knight",
  publishedYear: 2016,
  genre: ["Autobiography", "Business"],
  language: "English",
  country: "United States",
  rating: 4.5,
  summary:
    "An inspiring memoir by the co-founder of Nike, detailing the journey of building a global athletic brand.",
  coverImageUrl: "https://example.com/shoe_dog.jpg",
};

//3. Create an API to get all the books in the database as response. Make sure to do error handling.

async function readAllBooks() {
  try {
    const allBooks = await Book.find();
    if (allBooks.length != 0) {
      console.log(allBooks);
      return allBooks;
    }
  } catch (error) {
    console.log(error);
  }
}

//readAllBooks();

app.get("/books", async (req, res) => {
  try {
    const allBooks = await readAllBooks();
    if (allBooks.length != 0) {
      res
        .status(200)
        .json({ message: "All books retrieved.", allBooks: allBooks });
    } else {
      res.status(404).json({ error: "No book found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to load books." });
  }
});

//4. Create an API to get a book's detail by its title. Make sure to do error handling.

async function getBookByTitle(bookTitle) {
  try {
    const bookByTitle = await Book.findOne({ title: bookTitle });
    if (bookByTitle) {
      console.log(bookByTitle);
      return bookByTitle;
    } else {
      console.log("Book not found.");
    }
  } catch (error) {
    console.log("Failed to read a book.", error);
  }
}

//getBookByTitle("Lean In");

app.get("/books/:bookTitle", async (req, res) => {
  try {
    const bookByTitle = await getBookByTitle(req.params.bookTitle);
    if (bookByTitle) {
      res.status(200).json({ message: "Book Found.", book: bookByTitle });
    } else {
      res.status(404).json({ error: "Book not found." });
    }
  } catch (error) {
    res.status(404).json({ error: "Failed tom load the book." });
  }
});

//5. Create an API to get details of all the books by an author. Make sure to do error handling.

async function getBooksByAuthor(authorName) {
  try {
    const booksByAuthor = await Book.find({ author: authorName });
    if (booksByAuthor) {
      console.log("Books By author:", booksByAuthor);
      return booksByAuthor;
    } else {
      console.log("No books found.");
    }
  } catch (error) {
    console.log("Failed to load books.", error);
  }
}

//getBooksByAuthor("J.K. Rowling");

app.get("/books/authors/:authorName", async (req, res) => {
  try {
    const booksByAuthor = await getBooksByAuthor(req.params.authorName);
    if (booksByAuthor.length != 0) {
      res.status(200).json({ message: "Books by author: ", booksByAuthor });
    } else {
      res.status(404).json({ error: "No books found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to load books." });
  }
});

//6. Create an API to get all the books which are of "Business" genre.

async function getBooksByGenre(genreName) {
  try {
    const booksByGenre = await Book.find({ genre: genreName });
    if (booksByGenre) {
      console.log("Books By Genre:", booksByGenre);
      return booksByGenre;
    } else {
      console.log("No books found.");
    }
  } catch (error) {
    console.log("Failed to load books.", error);
  }
}

//getBooksByGenre("Fantasy");

app.get("/books/genres/:genreName", async (req, res) => {
  try {
    const booksByGenre = await getBooksByGenre(req.params.genreName);
    if (booksByGenre.length != 0) {
      res.status(200).json({ message: "Books by Genre", booksByGenre });
    } else {
      res.status(404).json({ error: "No books found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to load books." });
  }
});

//7. Create an API to get all the books which was released in the year 2012.
async function getBooksByReleaseYear(releaseYear) {
  try {
    const booksByReleaseYear = await Book.find({ publishedYear: releaseYear });
    if (booksByReleaseYear.length != 0) {
      console.log("Books By Release Year:", booksByReleaseYear);
      return booksByReleaseYear;
    } else {
      console.log("No books found.");
    }
  } catch (error) {
    console.log("Failed to load books.", error);
  }
}

//getBooksByReleaseYear(2012);

app.get("/books/publishedYear/:year", async (req, res) => {
  try {
    const booksByPublishedYear = await getBooksByReleaseYear(req.params.year);
    if (booksByPublishedYear.length != 0) {
      res
        .status(200)
        .json({ message: "Books by Published Year: ", booksByPublishedYear });
    } else {
      res.status(404).json({ error: "No books found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to load books." });
  }
});

//8. Create an API to update a book's rating with the help of its id. Update the rating of the "Lean In" from 4.1 to 4.5. Send an error message "Book does not exist", in case that book is not found. Make sure to do error handling. Updated book rating: { "rating": 4.5 }

async function updateBookById(bookId, dataToUpdate) {
  try {
    const updatedBook = await Book.findByIdAndUpdate(bookId, dataToUpdate, {
      new: true,
    });
    if (updatedBook) {
      console.log("Book updated successfully.", updatedBook);
      return updatedBook;
    } else {
      console.log("Book does not exist.", error);
    }
  } catch (error) {
    console.log("Failed to update the book.", error);
  }
}

//updateBookById("69f5b556903f69b99c701ed3", { rating: 4.6 });

app.post("/books/:bookId", async (req, res) => {
  try {
    const updatedBook = await updateBookById(req.params.bookId, req.body);

    if (updatedBook) {
      res.status(200).json({
        message: "Book updated successfully.",
        updatedBook: updatedBook,
      });
    } else {
      res.status(404).json({
        error: "Book does not exist.",
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update book." });
  }
});

//9. Create an API to update a book's rating with the help of its title. Update the details of the book "Shoe Dog". Use the query .findOneAndUpdate() for this. Send an error message "Book does not exist", in case that book is not found. Make sure to do error handling. { publishedYear: 2017, rating: 4.2 }

async function updateBookByTitle(bookTitle, dataToUpdate) {
  try {
    const updatedBook = await Book.findOneAndUpdate(
      { title: bookTitle },
      dataToUpdate,
      { returnDocument: "after" },
    );
    if (updatedBook) {
      console.log("Updated Book:", updatedBook);
      return updatedBook;
    } else {
      console.log("Book does not exist.", error);
    }
  } catch (error) {
    console.log("Failed to update the book", error);
  }
}

//updateBookByTitle("Shoe Dog", { publishedYear: 2017, rating: 4.2 });

app.post("/books/title/:bookTitle", async (req, res) => {
  try {
    const updatedBook = await updateBookByTitle(req.params.bookTitle, req.body);
    if (updatedBook) {
      res.status(200).json({
        message: "Book updated successfully.",
        updatedBook: updatedBook,
      });
    } else {
      res.status(404).json({ error: "Book does not exist." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update book." });
  }
});

//10. Create an API to delete a book with the help of a book id, Send an error message "Book not found" in case the book does not exist. Make sure to do error handling.

async function deleteBookById(bookId) {
  try {
    const deletedBook = await Book.findByIdAndDelete(bookId);
    if (deletedBook) {
      console.log("Book deleted successfully.", deletedBook);
      return deletedBook;
    } else {
      console.log("Book not found");
    }
  } catch (error) {
    console.log("Failed to delete the book.");
  }
}

//deleteBookById("69f726e5ea77d9b573ec6f74");

app.delete("/books/:bookId", async (req, res) => {
  try {
    const deletedBook = await deleteBookById(req.params.bookId);
    if (deletedBook) {
      res.status(200).json({
        message: "Book deleted successfully.",
        deletedBook: deletedBook,
      });
    } else {
      res.status(404).json({ error: "Book not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete book." });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});


*/
