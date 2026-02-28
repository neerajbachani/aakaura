
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const searchTerms = ['test throat', 'neck warmer'];
  const createdProducts: string[] = [];

  console.log("Scanning Journey content for missing products...");
  
  const journeys = await prisma.journey.findMany();
  const dbProducts = await prisma.product.findMany(); // Cache all existing product names for check
  const existingNames = new Set(dbProducts.map(p => p.name.toLowerCase().trim()));

  for (const journey of journeys) {
    const content = journey.content as any;
    if (!content) continue;

    const allItems = [
      ...(content['soul-luxury'] || []),
      ...(content['energy-curious'] || [])
    ];

    for (const item of allItems) {
      const itemName = item.name || '';
      
      // Check if this item matches our search terms
      const isMatch = searchTerms.some(term => itemName.toLowerCase().includes(term));
      
      if (isMatch) {
        // Check if it already exists in DB
        if (existingNames.has(itemName.toLowerCase().trim())) {
          console.log(`Skipping existing product: "${itemName}"`);
          continue;
        }

        console.log(`Creating missing product: "${itemName}"...`);
        
        // Generate a slug
        const slug = itemName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Math.floor(Math.random() * 1000);
        
        // Default category (since we don't know it from JSON, we'll try to guess or use a default)
        // For now, let's look for a generic category or default
        const defaultCategory = await prisma.category.findFirst();

        await prisma.product.create({
          data: {
            name: itemName,
            description: item.description || `Imported from ${journey.name} Journey`,
            price: parseFloat((item.price || "0").replace(/[^0-9.]/g, '')),
            images: item.images || [],
            categoryId: defaultCategory?.id || "", 
            isFeatured: false,
          }
        });
        
        createdProducts.push(itemName);
        existingNames.add(itemName.toLowerCase().trim()); // Prevent duplicates in this run
      }
    }
  }

  console.log(`\nSuccessfully created ${createdProducts.length} products:`);
  createdProducts.forEach(name => console.log(`- ${name}`));
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
