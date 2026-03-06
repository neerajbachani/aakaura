import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Fetching all journeys...');
  const journeys = await prisma.journey.findMany();
  
  let productsUpdated = 0;
  
  for (const journey of journeys) {
    const content: any = journey.content;
    const clientTypes = ['soul-luxury', 'energy-curious'];
    
    for (const clientType of clientTypes) {
      if (!content[clientType]) continue;
      
      for (const product of content[clientType]) {
        if (!product.id || !product.category) continue;
        
        console.log(`Processing product: ${product.name} (Category: ${product.category})`);
        
        // Find or create Category
        let cat = await prisma.category.findFirst({
            where: { name: { equals: product.category, mode: 'insensitive' } }
        });
        
        if (!cat) {
            console.log(`Creating new category: ${product.category}`);
            cat = await prisma.category.create({ data: { name: product.category } });
        }
        
        // Update product categoryId
        try {
            await prisma.product.upsert({
                where: { id: product.id },
                update: {
                    categoryId: cat.id,
                    name: product.name,
                    images: product.images || [],
                    price: parseFloat(String(product.price || "0").replace(/[^0-9.]/g, '')) || 0,
                },
                create: {
                    id: product.id,
                    name: product.name,
                    description: product.description || `Imported from ${journey.name} Journey`,
                    price: parseFloat(String(product.price || "0").replace(/[^0-9.]/g, '')) || 0,
                    images: product.images || [],
                    category: { connect: { id: cat.id } },
                    isFeatured: false,
                }
            });
            console.log(`✅ Upserted Product: ${product.name} with category: ${cat.name}`);
            productsUpdated++;
        } catch (error) {
             console.error(`❌ Error upserting Product ${product.name}:`, error);
        }
      }
    }
  }
  
  console.log(`\n🎉 Finished syncing categories! Synced ${productsUpdated} products.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
