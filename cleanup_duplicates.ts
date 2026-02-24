import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const products = await prisma.product.findMany({
    include: { variations: true, comboProducts: true, cartItems: true, orderItems: true },
    orderBy: { createdAt: 'asc' }
  });
  
  const names = new Map<string, any[]>();
  products.forEach(p => {
    const normName = p.name.trim().toLowerCase();
    if (!names.has(normName)) names.set(normName, []);
    names.get(normName)!.push(p);
  });
  
  for (const [name, prods] of names.entries()) {
    if (prods.length > 1) {
      // Sort so we keep the best one (prefer ones with relations, then oldest)
      prods.sort((a, b) => {
        const aScore = a.variations.length + a.comboProducts.length + a.cartItems.length + a.orderItems.length;
        const bScore = b.variations.length + b.comboProducts.length + b.cartItems.length + b.orderItems.length;
        if (aScore !== bScore) return bScore - aScore;
        return a.createdAt.getTime() - b.createdAt.getTime();
      });
      
      const toKeep = prods[0];
      const toDelete = prods.slice(1);
      
      console.log(`Keeping ${toKeep.id} for ${name}`);
      for (const p of toDelete) {
        console.log(`Deleting duplicate ${p.id}...`);
        await prisma.product.delete({ where: { id: p.id } });
      }
    }
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
