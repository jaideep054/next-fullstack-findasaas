import logger from "@/lib/logger";


// Product interface
interface Product {
  name: string;
  description: string;
  category?: string;
  logo: string;
  tool_url: string;
}

// Utility to truncate text
export const truncateDescription = (text: string | undefined | null, maxLength: number = 80): string => {
  if (!text || typeof text !== "string" || text.length <= maxLength) {
    return text || "";
  }

  let truncated = text.substring(0, maxLength);
  truncated = truncated.substring(0, Math.min(truncated.length, truncated.lastIndexOf(" ")));
  return truncated + "...";
};

// Build HTML from list of products
export const buildNewsletterHtml = (products: Product[]): string => {
  logger.info("Building newsletter HTML...");
  let productHtml = "";

  products.forEach((product) => {
    const descriptionShort = truncateDescription(product.description, 80);

    productHtml += `
        <!-- Product Row Start -->
        <tr>
          <td style="padding: 20px 0; border-bottom: 1px solid #e5e7eb;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <!-- Logo Column (Responsive Width) -->
                <td width="85" style="width: 85px; vertical-align: top; padding-right: 15px;">
                  <img src="${product.logo}" alt="${product.name}" width="80" style="max-width: 80px; height: auto; display: block; border: 1px solid #eee; border-radius: 8px;" border="0">
                </td>
                <!-- Details Column -->
                <td style="vertical-align: top; font-family: Arial, sans-serif; color: #374151;">
                  <h3 style="margin: 0 0 5px 0; font-size: 17px; font-weight: 600; color: #1f2937;">${product.name}</h3>
                  ${product.category ? `<p style="margin: 0 0 8px 0; font-size: 13px; color: #6b7280;">Category: ${product.category}</p>` : ""}
                  ${descriptionShort ? `<p style="margin: 0 0 12px 0; font-size: 14px; line-height: 1.5; color: #4b5563;">${descriptionShort}</p>` : ""}
                  <a href="${product.tool_url}" target="_blank" style="display: inline-block; padding: 8px 18px; background-color: #6366F1; color: #ffffff; font-size: 14px; font-weight: 500; text-decoration: none; border-radius: 6px; transition: background-color 0.2s;">View Product</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Product Row End -->
      `;
  });

  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Your Monthly Top Products!</title>
        <style type="text/css">
          /* Email styles here - unchanged */
          /* ... (the entire <style> tag remains the same) ... */
        </style>
      </head>
      <body style="margin: 0 !important; padding: 0 !important; background-color: #f8f8f8;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td align="center" style="padding: 20px 0;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" class="wrapper">
                <tr>
                  <td class="header">
                     <h1 style="font-size: 28px; margin: 0; color: #4f46e5; font-weight: 700;">FindYourSaaS</h1>
                  </td>
                </tr>
                <tr>
                  <td class="content">
                    <h2 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 10px 0;">This Month's Top Picks!</h2>
                    <p style="margin: 0 0 25px 0; font-size: 15px; line-height: 1.6; color: #374151;">Here's a selection of the most popular and useful SaaS tools discovered on FindYourSaaS this month:</p>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      ${productHtml} 
                    </table>
                  </td>
                </tr>
                <tr>
                  <td class="footer">
                    <p style="margin: 0 0 10px 0; font-size: 12px; color: #6b7280;">
                      You received this email because you subscribed to our newsletter at findyoursaas.com.
                    </p>
                     <p style="margin: 10px 0 0 0; font-size: 11px; color: #9ca3af;">
                        © ${new Date().getFullYear()} FindYourSaaS. All rights reserved.
                     </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
};
