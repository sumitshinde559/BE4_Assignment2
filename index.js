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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
