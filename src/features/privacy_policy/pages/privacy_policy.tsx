import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  Stack,
  TextField,
} from "@mui/material";

const TermsAndPayments = () => {
  const [isEditing, setIsEditing] = useState(false);

  const [content, setContent] = useState({
    section1: `In order to access the services of the Platform, You will have to register
and create an account on the Platform by providing required details.
Anusha Bazaar may collect personal information such as name, email,
age, photograph, address, mobile number, contact details, demographic
information and transaction details including financial information.`,

    section2: `You are solely responsible for the information provided. You must ensure
that your account information is accurate and updated. If any information
is found to be incorrect, Anusha Bazaar reserves the right to refuse services
or suspend access without prior notice.`,

    section3: `Confidentiality of your account credentials shall be your responsibility.
Anusha Bazaar disclaims any liability for losses due to unauthorized access.`,

    payments1: `All payments shall be made in Indian Rupees only. Accepted payment
methods may include credit/debit card, net banking, UPI, cash on delivery,
or other RBI-approved methods as displayed on the Platform.`,

    payments2: `Anusha Bazaar may use third-party payment gateways to process payments.
You agree to comply with the terms of such third-party providers.`,

    payments3: `You confirm that you are authorized to use the provided payment details
and are solely responsible for transactions made.`,

    payments4: `The payment facility is not a banking service but only a facilitator
providing electronic payment processing.`,
  });

  const handleChange = (key: string, value: string) => {
    setContent({ ...content, [key]: value });
  };

  return (
    <Box sx={{ p: 4, background: "#f5f7fb", minHeight: "100vh" }}>
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>

          <Typography variant="h5" fontWeight={700} gutterBottom>
            User Account, Password and Security
          </Typography>

          <Divider sx={{ mb: 3 }} />

          {/* Section 1 */}
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            1.1 Account Registration
          </Typography>

          {isEditing ? (
            <TextField
              fullWidth
              multiline
              rows={5}
              value={content.section1}
              onChange={(e) => handleChange("section1", e.target.value)}
              sx={{ mb: 3 }}
            />
          ) : (
            <Typography variant="body2" color="text.secondary" paragraph>
              {content.section1}
            </Typography>
          )}

          {/* Section 2 */}
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            1.2 Accuracy of Information
          </Typography>

          {isEditing ? (
            <TextField
              fullWidth
              multiline
              rows={5}
              value={content.section2}
              onChange={(e) => handleChange("section2", e.target.value)}
              sx={{ mb: 3 }}
            />
          ) : (
            <Typography variant="body2" color="text.secondary" paragraph>
              {content.section2}
            </Typography>
          )}

          {/* Section 3 */}
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            1.3 Account Confidentiality
          </Typography>

          {isEditing ? (
            <TextField
              fullWidth
              multiline
              rows={4}
              value={content.section3}
              onChange={(e) => handleChange("section3", e.target.value)}
              sx={{ mb: 3 }}
            />
          ) : (
            <Typography variant="body2" color="text.secondary" paragraph>
              {content.section3}
            </Typography>
          )}

          {/* Payments Section */}
          <Typography
            variant="h5"
            fontWeight={700}
            gutterBottom
            sx={{ mt: 4 }}
          >
            Payments Facility and Related Information
          </Typography>

          <Divider sx={{ mb: 3 }} />

          {["payments1", "payments2", "payments3", "payments4"].map((key) =>
            isEditing ? (
              <TextField
                key={key}
                fullWidth
                multiline
                rows={4}
                value={(content as any)[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                sx={{ mb: 2 }}
              />
            ) : (
              <Typography
                key={key}
                variant="body2"
                color="text.secondary"
                paragraph
              >
                {(content as any)[key]}
              </Typography>
            )
          )}

          <Divider sx={{ mt: 4, mb: 3 }} />

          {/* Buttons */}
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            {isEditing ? (
              <>
                <Button variant="outlined" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button variant="contained" onClick={() => setIsEditing(false)}>
                  Save
                </Button>
              </>
            ) : (
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            )}
          </Stack>

        </CardContent>
      </Card>
    </Box>
  );
};

export default TermsAndPayments;