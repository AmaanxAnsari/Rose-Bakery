import React from "react";
import { Helmet } from "react-helmet-async";

const Seo = ({ data = {}, fallback = {} }) => {
  const {
    seo_title,
    seo_description,
    seo_keywords,
    canonical_url,
    og_title,
    og_description,
    og_image,
    og_type,
    twitter_title,
    twitter_description,
    twitter_image,
    twitter_card,
    noindex,
    nofollow,
    json_ld,
  } = data || {};

  const {
    defaultTitle = "My Site",
    defaultDescription = "Default site description",
    defaultImage,
    siteName = "My Site",
    siteUrl = typeof window !== "undefined" ? window.location.origin : "",
  } = fallback || {};

  const currentUrl =
    canonical_url ||
    (typeof window !== "undefined" ? window.location.href : siteUrl);

  const finalTitle = seo_title || og_title || twitter_title || defaultTitle;
  const finalDescription =
    seo_description ||
    og_description ||
    twitter_description ||
    defaultDescription;
  const finalOgTitle = og_title || finalTitle;
  const finalOgDescription = og_description || finalDescription;
  const finalOgImage = og_image || twitter_image || defaultImage || "";
  const finalTwitterTitle = twitter_title || finalTitle;
  const finalTwitterDescription = twitter_description || finalDescription;
  const finalTwitterImage = twitter_image || finalOgImage;
  const finalTwitterCard = twitter_card || "summary_large_image";

  // Console debugging for you
  console.groupCollapsed("[SEO] Mapped data");
  console.log("Input data:", data);
  console.log("Final title:", finalTitle);
  console.log("Final description:", finalDescription);
  console.log("Canonical URL:", currentUrl);
  console.log("OG title:", finalOgTitle);
  console.log("OG description:", finalOgDescription);
  console.log("OG image:", finalOgImage);
  console.log("Twitter title:", finalTwitterTitle);
  console.log("Twitter description:", finalTwitterDescription);
  console.log("Twitter image:", finalTwitterImage);
  console.log("Noindex:", noindex);
  console.log("Nofollow:", nofollow);
  console.groupEnd();

  const robotsContent = [
    noindex ? "noindex" : "index",
    nofollow ? "nofollow" : "follow",
  ].join(",");

  // Try parsing JSON-LD safely
  let parsedJsonLd = null;
  if (json_ld) {
    try {
      parsedJsonLd = JSON.parse(json_ld);
    } catch (err) {
      console.warn("[SEO] Invalid json_ld, cannot parse:", err);
    }
  }

  return (
    <Helmet>
      {/* Basic */}
      <title>{finalTitle}</title>
      {finalDescription && (
        <meta name="description" content={finalDescription} />
      )}
      {seo_keywords && <meta name="keywords" content={seo_keywords} />}
      <meta name="robots" content={robotsContent} />

      {/* Canonical */}
      {currentUrl && <link rel="canonical" href={currentUrl} />}

      {/* OpenGraph */}
      {currentUrl && <meta property="og:url" content={currentUrl} />}
      <meta property="og:type" content={og_type || "website"} />
      <meta property="og:site_name" content={siteName} />
      {finalOgTitle && <meta property="og:title" content={finalOgTitle} />}
      {finalOgDescription && (
        <meta property="og:description" content={finalOgDescription} />
      )}
      {finalOgImage && <meta property="og:image" content={finalOgImage} />}

      {/* Twitter */}
      <meta name="twitter:card" content={finalTwitterCard} />
      {finalTwitterTitle && (
        <meta name="twitter:title" content={finalTwitterTitle} />
      )}
      {finalTwitterDescription && (
        <meta name="twitter:description" content={finalTwitterDescription} />
      )}
      {finalTwitterImage && (
        <meta name="twitter:image" content={finalTwitterImage} />
      )}

      {/* JSON-LD structured data */}
      {parsedJsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(parsedJsonLd)}
        </script>
      )}
    </Helmet>
  );
};

export default Seo;
