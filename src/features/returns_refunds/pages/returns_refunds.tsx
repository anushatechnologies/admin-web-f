import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
} from "@mui/material";

const PoliciesPage = () => {
  return (
    <Box sx={{ p: 4, background: "#f5f7fb", minHeight: "100vh" }}>
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>

          {/* TAXES */}
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Taxes on Your Order
          </Typography>

          <Typography variant="body2" sx={{ whiteSpace: "pre-line", mb: 3 }}>
{`In respect of the order placed by you on the Anusha Bazaar Platform, documents like order summary, tax invoices, etc. as mandated per the applicable law and common business practices shall be issued. Your order may have the following components and corresponding documents:

• Sale of goods – Tax invoice cum bill of supply issued by/on behalf of the relevant seller;
• Supply of services – Tax invoice issued by/on behalf of the relevant service provider.
• For Third Party Offerings, Tax Invoice/bill of supply shall be issued on behalf of the relevant Third Party Seller.
• The above documents can be seen on the order summary page once the goods have been delivered to you.

You acknowledge and agree that entitlement to any GST benefits shall be subject to GST terms and submission of valid GST number. Not all products/services are eligible for GST invoice.`}
          </Typography>

          <Divider sx={{ my: 4 }} />

          {/* ORDER CANCELLATION */}
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Order Cancellation
          </Typography>

          <Typography variant="body2" sx={{ whiteSpace: "pre-line", mb: 3 }}>
{`You acknowledge that cancellation or attempted cancellation may amount to breach of Terms and shall be permitted subject to acceptance by Anusha Bazaar.

Orders may be cancelled by Anusha Bazaar if:
(a) fraudulent transaction suspected
(b) violation of Terms
(c) product unavailability
(d) technical or logistical issues

Refunds for such cancellations will be initiated within approximately 72 hours.

Anusha Bazaar reserves the right to cancel orders and initiate refunds in the form of credit/cashback/coupon/promotional codes.

We reserve the right to deny access to fraudulent or non-complying users.`}
          </Typography>

          <Divider sx={{ my: 4 }} />

          {/* RETURNS & REFUNDS */}
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Returns & Refunds
          </Typography>

          <Typography variant="body2" sx={{ whiteSpace: "pre-line", mb: 3 }}>
{`Products once delivered/services once fulfilled are non-returnable except:

(a) damaged, defective, expired, or incorrectly delivered
(b) if the product policy expressly permits return

No refunds will be permitted due to:
• incorrect location provided
• unresponsive customer
• building restrictions

For digital goods (gift cards/vouchers), no return/refund applies.

All refunds for permitted returns and cancellations will be processed within 7 working days.

Refunds for COD purchases will be issued via promotional codes (valid 30 days).

Refunds cannot be transferred back to another payment method once initiated.

All refunds shall be made in Indian Rupees only.`}
          </Typography>

          <Divider sx={{ my: 4 }} />

          {/* RETURN POLICY */}
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Return Policy
          </Typography>

          <Typography variant="body2" paragraph>
            We have a 7-day return policy, which means you have 7 days after receiving your item to request a return.
          </Typography>

          <Divider sx={{ my: 4 }} />

          {/* REPLACEMENT */}
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Replacement / Exchange
          </Typography>

          <Typography variant="body2" paragraph>
            After inspecting the returned/damaged items we shall provide replacement / exchange within 7–10 business days.
          </Typography>

          <Divider sx={{ my: 4 }} />

          {/* REFUND PROCESS */}
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Refund Process
          </Typography>

          <Typography variant="body2" sx={{ whiteSpace: "pre-line", mb: 3 }}>
{`We will notify you once we’ve received and inspected your return.

If approved, you’ll be automatically refunded and credited on your original payment method within 7 business days.

If more than 15 business days have passed since approval, contact:
anushabazaar4@gmail.com`}
          </Typography>

          <Divider sx={{ my: 4 }} />

          {/* SHIPPING */}
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Shipping Policy
          </Typography>

          <Typography variant="body2">
            Products will get shipped and delivered in 6 to 8 days.
          </Typography>

        </CardContent>
      </Card>
    </Box>
  );
};

export default PoliciesPage;
