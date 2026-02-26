import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixCategories() {
  try {
    const requiredCategories = [
      'Wall Hanging',
      'Anchor',
      'Bonsai',
      'Jewellery',
      'Muffler',
      'Neck Warmer'
    ];

    // Ensure all required categories exist
    console.log('Ensuring all required categories exist...');
    const catMap = new Map<string, string>(); // name to ID
    for (const name of requiredCategories) {
      let cat = await prisma.category.findFirst({
        where: { name: { equals: name, mode: 'insensitive' } }
      });
      if (!cat) {
        cat = await prisma.category.create({ data: { name } });
        console.log(` Created category: ${name}`);
      } else {
        // Fix spelling if needed (e.g., 'Jewelry' -> 'Jewellery')
        if (cat.name !== name) {
            cat = await prisma.category.update({ where: { id: cat.id }, data: { name }});
            console.log(` Renamed category to: ${name}`);
        }
      }
      catMap.set(name, cat.id);
    }

    // Process all products and update their categories
    console.log('\nUpdating product categories...');
    const products = await prisma.product.findMany();
    
    for (const p of products) {
      const name = p.name.toLowerCase();
      let targetCatName = null;

      if (name.includes('muffler') || name.includes('aamvaraah muffler')) {
        targetCatName = 'Muffler';
      } else if (name.includes('neck warmer') || name.includes('aamvaraah neck warmer')) {
        targetCatName = 'Neck Warmer';
      } else if (name.includes('wall hanging') || name.includes('aayam')) {
        targetCatName = 'Wall Hanging';
      } else if (name.includes('bonsai')) {
        targetCatName = 'Bonsai';
      } else if (name.includes('aamoria') || name.includes('earrings') || name.includes('jhumkis') || name.includes('necklace')) {
        targetCatName = 'Jewellery';
      } else if (name.includes('anchor') || name.includes('drishti') || name.includes('sthiti') || name.includes('dhyaana shakti')) {
        targetCatName = 'Anchor';
      }

      if (targetCatName) {
        const targetCatId = catMap.get(targetCatName);
        if (p.categoryId !== targetCatId) {
          await prisma.product.update({
            where: { id: p.id },
            data: { categoryId: targetCatId }
          });
          console.log(` Updated '${p.name}' -> ${targetCatName}`);
        }
      }
    }

    console.log('\nCategories fixed successfully!');
  } catch (err) {
    console.error('Error fixing categories:', err);
  } finally {
    await prisma.$disconnect();
  }
}

fixCategories();
