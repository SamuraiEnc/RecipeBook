const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const iconv = require('iconv-lite'); // Добавляем для работы с кодировкой

// Настройки
const BASE_URL = 'https://www.povarenok.ru/recipes/dishes/first/';
const OUTPUT_FILE = 'recipes_full.json';
const MAX_RECIPES = 200; // Ограничиваем для теста
const DELAY_BETWEEN_REQUESTS = 100; // 2 секунды между запросами

// Задержка для избежания блокировки
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function parseRecipes() {
  try {
    console.log('⌛ Начинаю парсинг...');
    
    // 1. Получаем список всех ссылок на рецепты
    const recipeLinks = await getAllRecipeLinks();
    console.log(`🔗 Найдено ссылок: ${recipeLinks.length}`);

    // 2. Парсим каждый рецепт подробно (с ограничением MAX_RECIPES)
    const recipes = [];
    for (let i = 0; i < Math.min(recipeLinks.length, MAX_RECIPES); i++) {
      const recipeUrl = recipeLinks[i];
      console.log(`⏳ Парсинг рецепта ${i+1}/${Math.min(recipeLinks.length, MAX_RECIPES)}: ${recipeUrl}`);
      
      const recipeDetails = await parseSingleRecipe(recipeUrl);
      if (recipeDetails) {
        recipes.push(recipeDetails);
      }
      
      await delay(DELAY_BETWEEN_REQUESTS);
    }

    // 3. Сохраняем результаты
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(recipes, null, 2));
    console.log(`✅ Готово! Спарсено ${recipes.length} рецептов. Результаты в ${OUTPUT_FILE}`);
    
    return recipes;

  } catch (error) {
    console.error('❌ Ошибка парсинга:', error.message);
    return [];
  }
}

// Функция для получения всех ссылок на рецепты
async function getAllRecipeLinks() {
  const response = await axios.get(`${BASE_URL}/recipes/`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    responseType: 'arraybuffer'
  });
  
  const data = iconv.decode(response.data, 'win1251');
  const $ = cheerio.load(data);

  const links = [];
  $('.cat-list a').each((i, element) => {
    const href = $(element).attr('href');
    if (href) {
      links.push(href.startsWith('http') ? href : `${BASE_URL}${href}`);
    }
  });

  return [...new Set(links)]; // Удаляем дубликаты
}

// Функция для парсинга одного рецепта
async function parseSingleRecipe(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      responseType: 'arraybuffer'
    });
    
    const data = iconv.decode(response.data, 'win1251');

    const $ = cheerio.load(data);

    // Основная информация
    const title = $('h1').first().text().trim();
    const category = $('.article-breadcrumbs p span a').first().text().trim();
    const link = $('.item-bl h2 a').first().attr('href');
    
    // Ингредиенты
    const ingredients = [];
    $('.tab-content').first().each((i, element) => {
      const name = $(element).find('.tab-content p').text().trim();
      if (name) ingredients.push({ name });
    });
    
    return {
      url,
      title,
      category,
      link,
      ingredients,
    };
    
  } catch (error) {
    console.error(`⚠️ Ошибка при парсинге ${url}:`, error.message);
    return null;
  }
}

// Запуск парсера
parseRecipes();