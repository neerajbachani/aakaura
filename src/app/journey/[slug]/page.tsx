import { notFound } from "next/navigation";
import { chakrasData, getAllChakraSlugs } from "@/data/chakras";
import ChakraJourneyTemplate from "@/components/journey/ChakraJourneyTemplate";
import { Metadata } from "next";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return getAllChakraSlugs().map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const chakra = chakrasData[params.slug];
  
  if (!chakra) {
    return {
      title: "Journey Not Found",
    };
  }

  return {
    title: `${chakra.name} - ${chakra.tone} Journey | Aakaura`,
    description: chakra.description,
    keywords: [
      chakra.name,
      chakra.sanskritName,
      chakra.tone,
      "chakra",
      "spiritual journey",
      "energy healing",
      ...chakra.crystals,
    ],
  };
}

export default function ChakraJourneyPage({ params }: PageProps) {
  const chakra = chakrasData[params.slug];

  if (!chakra) {
    notFound();
  }

  return <ChakraJourneyTemplate chakra={chakra} />;
}
