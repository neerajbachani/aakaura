import { PrismaClient } from '@prisma/client'
import fs from 'fs'
const prisma = new PrismaClient()

async function main() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'asc' }
  });
  
  const names = new Map<string, any[]>();
  products.forEach(p => {
    // Normalize name to catch slight differences
    const normName = p.name.trim().toLowerCase();
    if (!names.has(normName)) names.set(normName, []);
    names.get(normName)!.push(p);
  });
  
  let dupCount = 0;
  let totalDups = 0;
  let lines: string[] = [];
  
  for (const [name, prods] of names.entries()) {
    if (prods.length > 1) {
      dupCount++;
      totalDups += prods.length - 1;
      lines.push(`\nDUPLICATE: ${name} (${prods.length} copies)`);
      prods.forEach(p => lines.push(`  - ID: ${p.id} | Name: ${p.name} | CreatedAt: ${p.createdAt.toISOString()}`));
    }
  }
  
  fs.writeFileSync('duplicates.log', `Total unique products with duplicates: ${dupCount}\nTotal extra copies to delete: ${totalDups}\n` + lines.join('\n'));
  console.log(`Found ${dupCount} products with duplicates. Total extra copies: ${totalDups}. Written to duplicates.log`);
}
main().catch(console.error).finally(() => prisma.$disconnect());
