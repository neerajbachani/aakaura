export type RitualLanguage = "en" | "hi";

export type RitualGuideLink = {
  language: RitualLanguage;
  href: string;
  external?: boolean;
  externalLabel?: string;
};

export type RitualGuide = {
  title: string;
  links: RitualGuideLink[];
};

export type RitualCategory = {
  id: string;
  label: string;
  guides: RitualGuide[];
};

function links(
  pairs: Partial<Record<RitualLanguage, string>>
): RitualGuideLink[] {
  const order: RitualLanguage[] = ["hi", "en"];
  return order
    .filter((language) => pairs[language])
    .map((language) => ({
      language,
      href: pairs[language]!,
    }));
}

function guide(title: string, pairs: Partial<Record<RitualLanguage, string>>): RitualGuide {
  return { title, links: links(pairs) };
}

export const ritualCategories: RitualCategory[] = [
  {
    id: "wall-hangings",
    label: "Wall Hangings",
    guides: [
      guide("Aakaura Simple Interaction with Prithvi Aayam", {
        hi: "https://drive.google.com/file/d/1P_U3NSV83_Nda9aa6Ug8onzYjtNK7ivj/view",
        en: "https://drive.google.com/file/d/1-xWmafwKVhZ6o-P2Ix-jX-vJs48lZ23Z/view",
      }),
      guide("Aakaura Simple Interaction with Vayu Aayam", {
        hi: "https://drive.google.com/file/d/18gD2SOZVem2uGIXMsvEkZifr_QLipR04/view",
        en: "https://drive.google.com/file/d/1WuvUGKo5_lePY2k9fG2YbdKajIOxIXPO/view",
      }),
      guide("Aakaura Ritual for Jal Aayam", {
        hi: "https://drive.google.com/file/d/1e_mggLtw4c6PohkT4JvthIdJXXEuylbn/view",
        en: "https://drive.google.com/file/d/13lZU54D1amvGa62HvU7hlGk5WLQvmwJF/view",
      }),
      guide("Aakaura Simple Interaction with Agni Aayam", {
        hi: "https://drive.google.com/file/d/1k0eMTxbM-NWXAPbPRz89k80v9TE9H-45/view",
        en: "https://drive.google.com/file/d/1zXAqRa_pJ0CoXbg1hHfL-_2cLO4uvcOn/view",
      }),
      guide("Aakaura Simple Interaction with Jnana Aayam", {
        hi: "https://drive.google.com/file/d/19zF_Ep3JIlJkjot-g-SIX2dJetMYJQ6o/view",
        en: "https://drive.google.com/file/d/1EoJZZRNI-L94XLxLaCybKfM6lUT6c6iV/view",
      }),
      guide("Aakaura Simple Interaction with Brahma Aayam", {
        hi: "https://drive.google.com/file/d/1rsj1mjw2aXp8s07Vxcsp8fFLWEDTcPv_/view",
        en: "https://drive.google.com/file/d/1N_kWj6kSH-eDhSVI4jRC9EAuPELBnY2i/view",
      }),
      guide("Aakaura Simple Interaction with Akasha Aayam", {
        hi: "https://drive.google.com/file/d/1CKEWfrGls5GWGARe4bZpCFkf1Jj9oL9r/view",
        en: "https://drive.google.com/file/d/1eZGInBbZtbXsr1joSdpFbBHRjdMa6YMm/view",
      }),
    ],
  },
  {
    id: "bonsais",
    label: "Bonsais",
    guides: [
      guide("Aakaura Interaction with Aarohma Solar Plexus Chakra Bonsai", {
        hi: "https://drive.google.com/file/d/1CbQZ_pi7ow3QikSB7NvUorIe-kgQVD3-/view",
        en: "https://drive.google.com/file/d/1wdAOPSVX210on4FO9Lrz1wTULYUPtw3t/view",
      }),
      guide("Aakaura Interaction with Aarohma Root Chakra", {
        hi: "https://drive.google.com/file/d/1FerOHzeFp3Hu0S4Kyy6QSseeKly9HHQH/view",
        en: "https://drive.google.com/file/d/1V-0N3BZ6BMJ6Ra4IqYffWoQV6x8i3XhS/view",
      }),
      guide("Aakaura Interaction with Aarohma Throat Chakra Bonsai", {
        hi: "https://drive.google.com/file/d/18TH7YvHEFOa-yH_WuCwtBmrp8FlDKrzE/view",
        en: "https://drive.google.com/file/d/1McOCG4Nse1C4iAKU2ZXGNWMjvO1GYpHY/view",
      }),
      guide("Aakaura Interaction with Aarohma Heart Chakra Bonsai", {
        hi: "https://drive.google.com/file/d/1VCym5GSGkjh53jCApf4IABxNw58_pUF-/view",
        en: "https://drive.google.com/file/d/1XvpGfXEgnQHUICUcqmdGyX0Nr4enmFk8/view",
      }),
      guide("Aakaura Interaction with Aarohma Sacral Chakra Bonsai", {
        hi: "https://drive.google.com/file/d/1KH1Hg2MAHhwhSKyBh_R4vIApmdSRsQ_V/view",
        en: "https://drive.google.com/file/d/1ZFuhRt_QHPtlNEfes1-H6DW4LIOSAEZB/view",
      }),
      guide("Aakaura Interaction with Aarohma Crown Chakra Bonsai", {
        hi: "https://drive.google.com/file/d/1Y5jJLfojphMM-tzeCUefmwp1DA9rJvYq/view",
        en: "https://drive.google.com/file/d/1NYBUj0WPXNMyfRd_jvmaOEBOX8BKXl6Y/view",
      }),
      guide("Aakaura Interaction with Aarohma Third Eye Chakra Bonsai", {
        hi: "https://drive.google.com/file/d/18RNydgwxBk7rw3aqRqGr_M6Pag_lQ3QQ/view",
        en: "https://drive.google.com/file/d/1ZjCqkoCSjMcfnkhI-WeyJz5qPTCJYFUk/view",
      }),
    ],
  },
  {
    id: "desk-anchors",
    label: "Desk Anchors & Wall Hanging",
    guides: [
      guide("Aakaura Simple Interaction with Sahasrara Sthiti", {
        hi: "https://drive.google.com/file/d/1qICuq7l4PTKjXLbxD2mJ07n1Wo6fWZFY/view",
        en: "https://drive.google.com/file/d/1akvJwKZ7USwaXWhxKQAlAjiqAlz_98Cu/view",
      }),
      guide("Aakaura Simple Interaction with Ajna Sthiti", {
        hi: "https://drive.google.com/file/d/1Qk9wi1PR-Rb1eyfdKwRFMCv_GVPsUpeb/view",
        en: "https://drive.google.com/file/d/1A8LoarF5COvq3WkmGLVYbcFYS2pVHgzI/view",
      }),
      guide("Aakaura Simple Interaction with Ajna Drishti", {
        hi: "https://drive.google.com/file/d/1XcA9f6NqR_8SjdSwBQiEghokA3jZXLeU/view",
        en: "https://drive.google.com/file/d/1yYr9B9OXjlwh0upbJiSykXdCGGwpcK_d/view",
      }),
      guide("Aakaura Simple Interaction with Sahasrara Dhyaana Shakti", {
        hi: "https://drive.google.com/file/d/1qy8pmAokS9SI1qdlknCWUiquMIXesl1A/view",
        en: "https://drive.google.com/file/d/1m0z5YTtyLlxZBRZSps9PHz1UYKmF_GYy/view",
      }),
    ],
  },
  {
    id: "muffler",
    label: "Muffler",
    guides: [
      guide("Aakaura Simple Interaction with Aamvaraah Himalayan Muffler", {
        hi: "https://drive.google.com/file/d/1HSkRnomKP2R0fbjWlm9sDGdrAIqUQVXx/view",
        en: "https://drive.google.com/file/d/1SfHqSVNHpupWqsGA9O2RSwRNgZDr79ey/view",
      }),
    ],
  },
  {
    id: "aamoria",
    label: "Heart Chakra Jhumkis and Necklace",
    guides: [
      guide("Aakaura Simple Interaction with Aamoria Necklace", {
        hi: "https://drive.google.com/file/d/1syLQ8Je_PL35lypOgYVjS-xI8au-BLiY/view",
        en: "https://drive.google.com/file/d/12wRnriFqZ9PU68cu8L7KZB1P6BNJWQGC/view",
      }),
      guide("Aakaura Simple Interaction with Aamoria Jhumkis", {
        hi: "https://drive.google.com/file/d/1_XuCCPRR5LJJOIuj01rqoVl6fEWQwpB9/view",
        en: "https://drive.google.com/file/d/1JZtmxP-vAISM4-WXUCfAlioLYvnCo7IB/view",
      }),
    ],
  },
];

export function getRitualDocumentCount(category: RitualCategory): number {
  return category.guides.reduce(
    (count, guideItem) => count + guideItem.links.length,
    0
  );
}
