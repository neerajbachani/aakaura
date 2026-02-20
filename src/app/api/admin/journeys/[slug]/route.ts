import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminToken } from "@/middleware/auth";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const user = await verifyAdminToken(request as any);
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }
        const { slug } = await params;
        const body = await request.json();

        const journey = await prisma.journey.update({
            where: { slug },
            data: body,
        });

        // Sync all products from journey content to the products table
        // This ensures combo product images stay up-to-date when edited here
        if (body.content) {
            const allProducts = [
                ...(body.content['soul-luxury'] || []),
                ...(body.content['energy-curious'] || []),
            ];

            if (allProducts.length > 0) {
                const defaultCategory = await prisma.category.findFirst();

                await Promise.all(
                    allProducts
                        .filter((product: any) => !!product.id)
                        .map((product: any) => {
                            const priceNum =
                                parseFloat(
                                    (product.price || '0').toString().replace(/[^0-9.]/g, '')
                                ) || 0;

                            return prisma.product.upsert({
                                where: { id: product.id },
                                update: {
                                    name: product.name,
                                    description: product.description || '',
                                    images: product.images || [],
                                    price: priceNum,
                                },
                                create: {
                                    id: product.id,
                                    name: product.name,
                                    description:
                                        product.description ||
                                        `Imported from ${journey.name} Journey`,
                                    images: product.images || [],
                                    price: priceNum,
                                    categoryId: defaultCategory?.id || '',
                                    isFeatured: false,
                                },
                            });
                        })
                );
            }
        }

        return NextResponse.json({
            success: true,
            data: journey
        });
    } catch (error) {
        console.error("Error updating journey:", error);
        return NextResponse.json(
            { error: "Failed to update journey" },
            { status: 500 }
        );
    }
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const journey = await prisma.journey.findUnique({
            where: { slug }
        });

        if (!journey) {
            return NextResponse.json(
                { error: "Journey not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(journey);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch journey" },
            { status: 500 }
        );
    }
}

