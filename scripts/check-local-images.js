const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany();
  
  console.log("Checking for products with local images...");
  
  const localImageProducts = products.filter(p => 
    p.images.some(img => !img.startsWith('http'))
  );

  if (localImageProducts.length === 0) {
    console.log("No products with local images found.");
  } else {
    console.log(`Found ${localImageProducts.length} products with local images:`);
    localImageProducts.forEach(p => {
      console.log(`- ${p.name} (${p.id})`);
      console.log(`  Images: ${JSON.stringify(p.images)}`);
    });
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
