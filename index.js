const API = "http://themealdb.com/api/json/v1/1/";
const app = document.querySelector(".app");
//console.log(app);
const screen = {
  main: app.querySelector(".main-screen"),
  recipe: app.querySelector(".recipe-screen"),
};
//console.log(screen);
// เมื่อเอกสารโหลดเสร็จแล้ว
document.addEventListener("DOMContentLoaded", function () {
  // หาปุ่มย้อนกลับด้านบนสุด
  var scrollToTopBtn = document.getElementById("scrollToTopBtn");

  // เมื่อมีการเลื่อนหน้าเว็บ
  window.addEventListener("scroll", function () {
    // ถ้าเลื่อนลงมากกว่า 20px แสดงปุ่ม
    if (window.scrollY > 20) {
      scrollToTopBtn.style.display = "block";
    } else {
      scrollToTopBtn.style.display = "none";
    }
  });

  // เมื่อคลิกที่ปุ่ม
  scrollToTopBtn.addEventListener("click", function () {
    // ใช้คำสั่ง scroll ให้กลับขึ้นด้านบนสุด
    window.scrollTo({
      top: 0,
      behavior: "smooth", // ให้มีเอฟเฟคการเลื่อน
    });
  });
});

const showFullRecipe = async (id) => {
  screen.main.classList.add("hidden");
  screen.recipe.classList.remove("hidden");

  screen.recipe.querySelector(".back-btn").addEventListener("click", () => {
    screen.recipe.classList.add("hidden");
    screen.main.classList.remove("hidden");
    screen.recipe.querySelector(".thumbnail img").innerHTML = "";
    screen.recipe.querySelector(".details h2").innerHTML = "";
    screen.recipe.querySelector(".details ul").innerHTML = "";
    screen.recipe.querySelector(".details ol").innerHTML = "";
  });
  try {
    const res = await fetch(API + "lookup.php?i=" + id);
    const data = await res.json();
    const recipe = data.meals[0];
    console.log(recipe);
    screen.recipe.querySelector(".thumbnail img").src = recipe.strMealThumb;
    screen.recipe.querySelector(".details h2").innerText = recipe.strMeal;
    for (let i = 1; i <= 20; i++) {
      //console.log(recipe["strIngredient" + i]);
      if (recipe["strIngredient" + i].length == 0) {
        break;
      }
      const li = document.createElement("li");
      li.innerText = `${recipe["strIngredient" + i]} = ${
        recipe["strMeasure" + i]
      }
                `;
      screen.recipe.querySelector(".details ul").appendChild(li);
    }

    let instructions = recipe.strInstructions
      .split("\r\n")
      .filter((str) => str);
    for (let i = 0; i < instructions.length; i++) {
      let li = document.createElement("li");
      li.innerText = instructions[i];
      screen.recipe.querySelector(".details ol").appendChild(li);
    }
  } catch (error) {
    console.error("showFullRecipe:", error);
  }
};

const getRecipeOfCategory = async (category) => {
  screen.main.querySelector(".recipe-list").innerHTML = "";
  try {
    const res = await fetch(API + "filter.php?c=" + category);
    const data = await res.json();
    const recipes = data.meals;
    for (let i = 0; i < recipes.length; i++) {
      const div = document.createElement("div");
      div.classList.add("item");
      div.addEventListener("click", () => {
        showFullRecipe(recipes[i].idMeal);
      });
      div.innerHTML = `
            <div class="thumbnail">
            <img src="${recipes[i].strMealThumb}" />
            </div>
            <div class="details">
            <h2>${recipes[i].strMeal} </h2>
            </div>
            `;
      screen.main.querySelector(".recipe-list").appendChild(div);
    }
    console.log(data);
  } catch (error) {
    console.error("getRecipe:", error);
  }
};

const main = async () => {
  try {
    const res = await fetch(API + "list.php?c=list");
    const data = await res.json();
    const categories = data.meals;
    //console.log(categories);
    for (let i = 0; i < categories.length; i++) {
      let div = document.createElement("div");
      div.innerText = categories[i].strCategory;
      div.addEventListener("click", () => {
        screen.main
          .querySelector(".categories .active")
          .classList.remove("active");
        div.classList.add("active");
        getRecipeOfCategory(categories[i].strCategory);
      });
      if (i == 0) {
        div.classList.add("active");
        getRecipeOfCategory(categories[i].strCategory);
      }
      screen.main.querySelector(".categories").appendChild(div);
    }
  } catch (error) {
    console.error("Main:", error);
  }
};

main();
