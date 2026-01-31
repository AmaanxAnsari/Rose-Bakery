import React from "react";
import { useGetSeoByPageQuery } from "../../api/seoApiSlice";
import Seo from "../../seo/Seo";

const About = () => {
  const { data } = useGetSeoByPageQuery("about-us");
  return (
    <>
      <Seo
        data={data?.data}
        fallback={{
          defaultTitle:
            "About Compumatrix Technologies - Custom Software Development Company",
          defaultDescription:
            "Compumatrix Technologies is a global custom software development company delivering high-quality web, mobile, e-commerce, testing, and digital marketing solutions.",
          defaultImage: "https://compumatrixtechnologies.com/about-og.jpg",
          siteName: "Compumatrix Technologies",
          siteUrl: "https://compumatrixtechnologies.com/about-us",
        }}
      />
      <div>About</div>
    </>
  );
};

export default About;
