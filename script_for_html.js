const btCreateRecipe = document.querySelector('.btn-create-menu');
const RecipeTitle1 = document.getElementById('RecipeTitleEl');
let recipes = []; // Для хранения данных

// Загрузка JSON при загрузке страницы
fetch('recipes_full.json')
  .then(response => response.json())
  .then(data => {
    recipes = data;
    console.log('Данные загружены:', recipes[0].title);
  })
  .catch(error => console.error('Ошибка загрузки:', error));


btCreateRecipe.addEventListener('click', () => {
    let rand_recipe1 = Math.floor(Math.random() * recipes.length);
    let rand_recipe2 = Math.floor(Math.random() * recipes.length);
    let rand_recipe3 = Math.floor(Math.random() * recipes.length);
    let rand_recipe4 = Math.floor(Math.random() * recipes.length);
    
    RecipeTitle1.textContent = recipes[rand_recipe1].title;
});

