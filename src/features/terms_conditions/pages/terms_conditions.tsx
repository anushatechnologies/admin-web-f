import React from "react";
import { Box, Typography, Divider } from "@mui/material";

const TermsOfUse = () => {
  return (
    <Box
      sx={{
        maxWidth: "950px",
        margin: "40px auto",
        padding: "40px",
        backgroundColor: "#fff",
        borderRadius: 2,
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        lineHeight: 1.9,
      }}
    >
      {/* Main Title */}
      <Typography sx={{ fontSize: "20px", fontWeight: 700, mb: 3 }}>
        1. Terms of Use
      </Typography>

      {/* Body Text */}
      <Typography sx={{ fontSize: "13px", color: "text.secondary", mb: 2 }}>
        1.1. The websites http://Anushabazaar.com (“Website”) and mobile
        application ‘Anusha Bazaar’ (App) (collectively referred to as the
        “Platform”) are owned and operated by Anusha Bazaar Marketplace
        Private Limited, incorporated under the Indian Companies Act, 2013,
        with its registered office at 2nd Floor, JayaPrakash Nagar Colony,
        Yellareddyguda, Ameerpet, Hyderabad-500073.
      </Typography>

      <Typography sx={{ fontSize: "13px", color: "text.secondary", mb: 2 }}>
        1.2. These Terms govern your use of the Platform. By accessing the
        Platform, you agree to be bound by these Terms and other applicable
        policies including cancellation, refund and privacy policies.
      </Typography>

      <Typography sx={{ fontSize: "13px", color: "text.secondary", mb: 2 }}>
        1.3. If you do not agree with these Terms, you must discontinue use of
        the Platform. Continued access signifies your acceptance.
      </Typography>

      <Typography sx={{ fontSize: "13px", color: "text.secondary", mb: 4 }}>
        1.4. Anusha Bazaar reserves the right to modify these Terms at any
        time. Continued use after modification constitutes acceptance of the
        updated Terms.
      </Typography>

      <Divider sx={{ my: 4 }} />

      {/* Section 2 */}
      <Typography sx={{ fontSize: "18px", fontWeight: 600, mb: 3 }}>
        2. Access to Services
      </Typography>

      <Typography sx={{ fontSize: "13px", color: "text.secondary", mb: 2 }}>
        2.1. Anusha Bazaar facilitates transactions between Users and Sellers
        across select serviceable areas in India.
      </Typography>

      <Typography sx={{ fontSize: "13px", color: "text.secondary", mb: 2 }}>
        2.2. Users are granted a limited, non-exclusive, non-transferable,
        revocable right to access the Platform for purchasing Products and
        Services.
      </Typography>

      <Typography sx={{ fontSize: "13px", color: "text.secondary", mb: 2 }}>
        2.3. This access does not permit resale or commercial use of the
        Platform content.
      </Typography>

      <Typography sx={{ fontSize: "13px", color: "text.secondary", mb: 2 }}>
        2.4. Products may be ranked organically based on user preferences and
        engagement metrics.
      </Typography>

      <Typography sx={{ fontSize: "13px", color: "text.secondary", mb: 4 }}>
        2.5. Anusha Bazaar acts solely as a marketplace facilitator and does
        not take ownership of Products.
      </Typography>

      <Divider sx={{ my: 4 }} />

      {/* Delivery Partners */}
      <Typography sx={{ fontSize: "18px", fontWeight: 600, mb: 3 }}>
        Delivery Partners
      </Typography>

      <Typography sx={{ fontSize: "13px", color: "text.secondary", mb: 4 }}>
        Delivery services are provided by independent contractors on a
        principal-to-principal basis. Anusha Bazaar is not liable for the
        actions or omissions of delivery partners.
      </Typography>

      <Divider sx={{ my: 4 }} />

      {/* Customer Comments */}
      <Typography sx={{ fontSize: "18px", fontWeight: 600, mb: 3 }}>
        Customer Comments, Reviews & Ratings
      </Typography>

      <Typography sx={{ fontSize: "13px", color: "text.secondary", mb: 2 }}>
        Comments include reviews, ratings, feedback, images, and other user
        content submitted on the Platform.
      </Typography>

      <Typography sx={{ fontSize: "13px", color: "text.secondary", mb: 2 }}>
        By submitting Comments, you grant Anusha Bazaar a worldwide,
        royalty-free license to use and display such content.
      </Typography>

      <Typography sx={{ fontSize: "13px", color: "text.secondary", mb: 2 }}>
        Comments must not contain unlawful, abusive, or misleading content.
      </Typography>

      <Typography sx={{ fontSize: "13px", color: "text.secondary", mb: 4 }}>
        Anusha Bazaar reserves the right to remove any content that violates
        these Terms.
      </Typography>

      <Divider sx={{ my: 4 }} />

      {/* Governing Law */}
      <Typography sx={{ fontSize: "18px", fontWeight: 600, mb: 3 }}>
        Governing Law
      </Typography>

      <Typography sx={{ fontSize: "13px", color: "text.secondary" }}>
        These Terms shall be governed in accordance with the laws of
        Hyderabad, India.
      </Typography>
    </Box>
  );
};

export default TermsOfUse;