import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from "@/middleware/auth";

// PATCH /api/admin/journeys/[slug]/products - Update product settings
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const user = await verifyAdminToken(request);
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        const { slug } = await params;
        const body = await request.json();
        const { productId, isWaitlist } = body;

        if (!productId || typeof isWaitlist !== 'boolean') {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Get the journey
        const journey = await prisma.journey.findUnique({
            where: { slug },
        });

        if (!journey) {
            return NextResponse.json(
                { error: 'Journey not found' },
                { status: 404 }
            );
        }

        // Update product settings
        const currentSettings = (journey.productSettings as Record<string, any>) || {};

        currentSettings[productId] = {
            isWaitlist,
            updatedAt: new Date().toISOString(),
            updatedBy: user.email, // Use email for admin tokens
        };

        const updatedJourney = await prisma.journey.update({
            where: { slug },
            data: {
                productSettings: currentSettings,
            },
        });

        return NextResponse.json({
            message: 'Product settings updated',
            journey: updatedJourney,
        });
    } catch (error: any) {
        console.error('Error updating product settings:', error);

        return NextResponse.json(
            { error: 'Failed to update product settings' },
            { status: 500 }
        );
    }
}

// GET /api/admin/journeys/[slug]/products - Get product settings
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const user = await verifyAdminToken(request);
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        const { slug } = await params;

        const journey = await prisma.journey.findUnique({
            where: { slug },
            select: {
                id: true,
                slug: true,
                name: true,
                content: true,
                productSettings: true,
            },
        });

        if (!journey) {
            return NextResponse.json(
                { error: 'Journey not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ journey });
    } catch (error: any) {
        console.error('Error fetching product settings:', error);

        return NextResponse.json(
            { error: 'Failed to fetch product settings' },
            { status: 500 }
        );
    }
}

// POST /api/admin/journeys/[slug]/products - Add product to journey
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const user = await verifyAdminToken(request);
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        const { slug } = await params;
        const body = await request.json();
        const { clientType, product } = body;

        if (!clientType || !product) {
            return NextResponse.json(
                { error: 'Missing required fields: clientType and product' },
                { status: 400 }
            );
        }

        if (clientType !== 'soul-luxury' && clientType !== 'energy-curious') {
            return NextResponse.json(
                { error: 'Invalid clientType. Must be "soul-luxury" or "energy-curious"' },
                { status: 400 }
            );
        }

        // Get the journey
        const journey = await prisma.journey.findUnique({
            where: { slug },
        });

        if (!journey) {
            return NextResponse.json(
                { error: 'Journey not found' },
                { status: 404 }
            );
        }

        // Parse current content
        const currentContent = journey.content as any;
        const products = currentContent[clientType] || [];

        // Check if product ID already exists
        if (products.some((p: any) => p.id === product.id)) {
            return NextResponse.json(
                { error: `Product with ID "${product.id}" already exists in ${clientType}` },
                { status: 409 }
            );
        }

        // Add new product
        products.push(product);
        currentContent[clientType] = products;

        // SYNC: Upsert product to the Product table
        // We use upsert to handle cases where it might already exist (though check above tries to prevent it)
        // We generate a slug if not provided/able to be derived nicely
        const productSlug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Math.floor(Math.random() * 1000);
        
        // Find a default category
        const defaultCategory = await prisma.category.findFirst();

        await prisma.product.upsert({
            where: { id: product.id }, // Assuming product.id is generated by frontend or we need to generate it
            update: {
                name: product.name,
                description: product.description || `Imported from ${journey.name} Journey`,
                price: parseFloat(String(product.price || "0").replace(/[^0-9.]/g, '')) || 0,
                images: product.images || [],
                // specifications: product.specifications || {}, // Field does not exist on Product model
                // careInstructions: product.careInstructions || "", // Field does not exist on Product model
            },
            create: {
                id: product.id, // Use the same ID
                name: product.name,
                // slug: productSlug, // Field does not exist
                description: product.description || `Imported from ${journey.name} Journey`,
                price: parseFloat(String(product.price || "0").replace(/[^0-9.]/g, '')) || 0,
                images: product.images || [],
                category: {
                    connect: { id: defaultCategory?.id || "" }
                },
                isFeatured: false,
            }
        });

        // Update journey
        const updatedJourney = await prisma.journey.update({
            where: { slug },
            data: {
                content: currentContent,
            },
        });

        return NextResponse.json({
            message: 'Product added successfully',
            journey: updatedJourney,
        });
    } catch (error: any) {
        console.error('Error adding product:', error);

        return NextResponse.json(
            { error: 'Failed to add product' },
            { status: 500 }
        );
    }
}

// DELETE /api/admin/journeys/[slug]/products - Remove product from journey
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const user = await verifyAdminToken(request);
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        const { slug } = await params;
        const body = await request.json();
        const { clientType, productId } = body;

        if (!clientType || !productId) {
            return NextResponse.json(
                { error: 'Missing required fields: clientType and productId' },
                { status: 400 }
            );
        }

        if (clientType !== 'soul-luxury' && clientType !== 'energy-curious') {
            return NextResponse.json(
                { error: 'Invalid clientType. Must be "soul-luxury" or "energy-curious"' },
                { status: 400 }
            );
        }

        // Get the journey
        const journey = await prisma.journey.findUnique({
            where: { slug },
        });

        if (!journey) {
            return NextResponse.json(
                { error: 'Journey not found' },
                { status: 404 }
            );
        }

        // Parse current content
        const currentContent = journey.content as any;
        const products = currentContent[clientType] || [];

        // Find product index
        const productIndex = products.findIndex((p: any) => p.id === productId);

        if (productIndex === -1) {
            return NextResponse.json(
                { error: `Product with ID "${productId}" not found in ${clientType}` },
                { status: 404 }
            );
        }

        // Remove product
        products.splice(productIndex, 1);
        currentContent[clientType] = products;

        // SYNC: Delete product from Product table
        try {
            await prisma.product.delete({
                where: { id: productId }
            });
        } catch (e) {
            console.log(`Product ${productId} already deleted or not found in Product table`);
        }

        // Update journey
        const updatedJourney = await prisma.journey.update({
            where: { slug },
            data: {
                content: currentContent,
            },
        });

        return NextResponse.json({
            message: 'Product deleted successfully',
            journey: updatedJourney,
        });
    } catch (error: any) {
        console.error('Error deleting product:', error);

        return NextResponse.json(
            { error: 'Failed to delete product' },
            { status: 500 }
        );
    }
}

// PUT /api/admin/journeys/[slug]/products - Update product in journey
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const user = await verifyAdminToken(request);
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        const { slug } = await params;
        const body = await request.json();
        const { clientType, productId, product } = body;
        
        console.log(`📡 PUT Request - Slug: ${slug}, ClientType: ${clientType}, ProductID: ${productId}`);

        if (!clientType || !productId || !product) {
            return NextResponse.json(
                { error: 'Missing required fields: clientType, productId, and product' },
                { status: 400 }
            );
        }

        if (clientType !== 'soul-luxury' && clientType !== 'energy-curious') {
            return NextResponse.json(
                { error: 'Invalid clientType. Must be "soul-luxury" or "energy-curious"' },
                { status: 400 }
            );
        }

        // Get the journey
        const journey = await prisma.journey.findUnique({
            where: { slug },
        });

        if (!journey) {
            return NextResponse.json(
                { error: 'Journey not found' },
                { status: 404 }
            );
        }

        // Parse current content
        const currentContent = journey.content as any;
        const products = currentContent[clientType] || [];

        // Find product index
        const productIndex = products.findIndex((p: any) => p.id === productId);

        if (productIndex === -1) {
            console.error(`❌ Product with ID "${productId}" not found in ${clientType}. Available IDs:`, products.map((p:any) => p.id));
            return NextResponse.json(
                { error: `Product with ID "${productId}" not found in ${clientType}` },
                { status: 404 }
            );
        }

        // Update product
        products[productIndex] = { ...product, id: productId }; // Ensure ID doesn't change
        currentContent[clientType] = products;

        // SYNC: Update product in Product table (Use upsert to handle ghost products)
        const defaultCategory = await prisma.category.findFirst();
        
        await prisma.product.upsert({
            where: { id: productId },
            update: {
                name: product.name,
                description: product.description,
                price: parseFloat(String(product.price || "0").replace(/[^0-9.]/g, '')) || 0,
                images: product.images || [],
            },
            create: {
                id: productId,
                name: product.name,
                description: product.description || `Imported from ${journey.name} Journey`,
                price: parseFloat(String(product.price || "0").replace(/[^0-9.]/g, '')) || 0,
                images: product.images || [],
                category: {
                    connect: { id: defaultCategory?.id || "" }
                },
                isFeatured: false,
            }
        });

        // Update journey
        const updatedJourney = await prisma.journey.update({
            where: { slug },
            data: {
                content: currentContent,
            },
        });

        return NextResponse.json({
            message: 'Product updated successfully',
            journey: updatedJourney,
        });
    } catch (error: any) {
        console.error('Error updating product:', error);

        return NextResponse.json(
            { error: 'Failed to update product' },
            { status: 500 }
        );
    }
}
