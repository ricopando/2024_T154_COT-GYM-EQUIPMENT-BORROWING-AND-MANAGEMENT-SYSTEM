import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import React from "react";

const StudentBorrowerSlipPreview = ({
  userDetails,
  borrowedItems,
  onClose,
}) => {
  const [pdfUrl, setPdfUrl] = useState(null);

  const generatePDF = (preview = false) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const marginTop = 5;
    const marginBottom = 20;

    // Updated header function
    const header = () => {
      const imageUrl =
        "https://th.bing.com/th/id/OIP.081z0bkyijEfgDcNKjeS5AHaHa?rs=1&pid=ImgDetMain";
      const imageWidth = 25;
      const imageHeight = 25;
      const startX = 20;
      const startY = marginTop;

      // Add image
      doc.addImage(imageUrl, "PNG", startX, startY, imageWidth, imageHeight);

      // Center align all text
      const centerX = pageWidth / 2;

      // Add text centered
      doc.setFont("Arial", "bold");
      doc.setFontSize(12);
      doc.text("BUKIDNON STATE UNIVERSITY", centerX, startY + 8, {
        align: "center",
      });

      doc.setFont("Arial", "normal");
      doc.setFontSize(10);
      doc.text(
        "Fortich Street, Malaybalay City, Bukidnon 8700",
        centerX,
        startY + 14,
        { align: "center" }
      );

      // Contact information and website on one line
      const contactText =
        "Tel (088) 813-5661 to 5663; Telefax (088) 813-2717, ";
      const websiteText = "www.buksu.edu.ph";

      // Calculate total width for centering
      const totalWidth = doc.getTextWidth(contactText + websiteText);
      const startTextX = centerX - totalWidth / 2;

      // Add contact info
      doc.text(contactText, startTextX, startY + 20);

      // Add website with blue color and underline
      doc.setTextColor(0, 0, 255);
      doc.textWithLink(
        websiteText,
        startTextX + doc.getTextWidth(contactText),
        startY + 20,
        {
          url: "http://www.buksu.edu.ph",
        }
      );

      // Underline the website
      doc.line(
        startTextX + doc.getTextWidth(contactText),
        startY + 21,
        startTextX + totalWidth,
        startY + 21
      );

      doc.setTextColor(0, 0, 0); // Reset text color

      // Bottom line
      doc.setLineWidth(0.5);
      doc.line(20, startY + 30, pageWidth - 20, startY + 30);
      doc.setLineWidth(0.1);
    };

    // Footer function
    const footer = () => {
      const pageCount = doc.internal.getNumberOfPages();
      const startY = doc.internal.pageSize.getHeight() - marginBottom;
      doc.text(
        `Document Code: OSP-F-001          Revision No: 0            Issue No. 1           Issue Date: 4/23/2021             Page 1of  ${pageCount}`,
        pageWidth / 2,
        startY + 15,
        { align: "center" }
      );
    };

    const mainContent = () => {
      const startY = marginTop + 35;
      const lineHeight = 7;
      let currentY = startY;

      // Title
      doc.setFont("Arial", "bold");
      doc.setFontSize(12);
      doc.text("OFFICE OF THE SPORTS PROGRAM", pageWidth / 2, currentY, {
        align: "center",
      });

      currentY += lineHeight + 3;
      doc.setFontSize(11);
      doc.text("BORROWER'S SLIP", pageWidth / 2, currentY, { align: "center" });

      // Checkboxes and labels with adjusted spacing
      currentY += lineHeight; // Increased spacing after title
      doc.setFont("Arial", "normal");
      doc.setFontSize(10);

      const startX = 20; // Moved start position to the right
      const checkboxSize = 4;
      const labelSpacing = 35; // Increased spacing between checkbox groups

      // Draw checkboxes and labels with more spacing
      const categories = [
        "Coach/Trainer",
        "Athlete",
        "Regular Student",
        "BukSU Personnel",
        "P.E. Instructor",
      ];

      categories.forEach((label, index) => {
        const xPos = startX + index * labelSpacing;
        // Draw checkbox
        doc.rect(xPos, currentY - 3, checkboxSize, checkboxSize);
        // Add label with more spacing
        doc.text(label, xPos + checkboxSize + 2, currentY);
      });

      // Others field with more spacing

      currentY += lineHeight + 2;
      doc.setFont("Arial", "bold");
      doc.rect(startX, currentY - 3, checkboxSize, checkboxSize);
      doc.text("Others (Office/Agency):", startX + checkboxSize + 1, currentY);
      doc.line(startX + 42, currentY, pageWidth - 80, currentY);

      // For Custodian field with adjusted spacing
      currentY += lineHeight + 2;

      doc.text("For Custodian:", startX, currentY);
      doc.line(startX + 24, currentY, pageWidth - 100, currentY);
      doc.setFont("Arial", "normal");
      currentY += lineHeight - 2;
      doc.text("Availability of Equipment :", startX, currentY);
      // Yes checkbox
      doc.rect(pageWidth - 148, currentY - 3, checkboxSize, checkboxSize);
      doc.text("YES", pageWidth - 143, currentY);
      // No checkbox
      doc.rect(pageWidth - 130, currentY - 3, checkboxSize, checkboxSize);
      doc.text("NO", pageWidth - 125, currentY);

      // For Borrower field
      currentY += lineHeight;
      doc.setFont("Arial", "bold");
      doc.text("For Borrower:", startX, currentY);
      doc.line(startX + 24, currentY, pageWidth - 100, currentY);

      // Acknowledgment text with adjusted spacing
      currentY += lineHeight - 3;
      const acknowledgmentY = currentY;
      doc.setFont("Arial", "normal");
      doc.text(
        "I acknowledge to have received from the",
        startX,
        acknowledgmentY
      );
      doc.setFont("Arial", "bold");
      doc.text("OFFICE OF SPORTS PROGRAM", startX + 58.5, acknowledgmentY);
      doc.setFont("Arial", "normal");
      doc.text("of", startX + 112.5, acknowledgmentY);
      doc.setFont("Arial", "bold");
      doc.text("Bukidnon State", startX + 116.5, acknowledgmentY);

      currentY += lineHeight - 3;
      doc.text("University", startX, currentY);
      doc.setFont("Arial", "normal");
      doc.text("the following:", startX + 16.5, currentY);

      // Add table
      currentY += lineHeight - 3;
      const tableStartY = currentY;
      const columns = [
        "SERIAL #",
        "NAME",
        "BORROW DATE",
        "RETURN DATE",
        "RETURNED",
      ];
      const columnWidths = [40, 40, 30, 30, 30];
      const cellPadding = 3;
      const rowHeight = 10;

      // Calculate starting X position for the table to center it
      const tableWidth = columnWidths.reduce((sum, width) => sum + width, 0);
      const tableStartX = (pageWidth - tableWidth) / 2;

      // Draw table headers
      let currentX = tableStartX;
      doc.setFont("Arial", "normal");
      doc.setFontSize(7);

      // Draw header cells
      columns.forEach((header, index) => {
        doc.rect(currentX, tableStartY, columnWidths[index], rowHeight);
        doc.text(header, currentX + cellPadding, tableStartY + 5);
        currentX += columnWidths[index];
      });

      // Draw rows with borrowed data
      if (borrowedItems && borrowedItems.items) {
        let currentRowY = tableStartY + rowHeight;

        borrowedItems.items.forEach((item) => {
          currentX = tableStartX;

          // Row data
          const rowData = [
            item.equipment?.serialNumber || "",
            item.equipment?.name || "",
            new Date(borrowedItems.createdAt).toLocaleDateString() || "",
            item.returnDate
              ? new Date(item.returnDate).toLocaleDateString()
              : "",
            item.status || "",
          ];

          // Calculate required height for the name cell
          doc.setFont("Arial", "normal");
          doc.setFontSize(7);
          const nameWidth = columnWidths[1] - cellPadding * 2;
          const nameLines = doc.splitTextToSize(rowData[1], nameWidth);
          const requiredHeight = Math.max(
            rowHeight,
            nameLines.length * 3.5 + 4
          );

          // Draw cells with adjusted height
          rowData.forEach((cellData, cellIndex) => {
            // Draw cell rectangle
            doc.rect(
              currentX,
              currentRowY,
              columnWidths[cellIndex],
              requiredHeight
            );

            if (cellIndex === 1) {
              // Handle wrapped name text
              nameLines.forEach((line, lineIndex) => {
                doc.text(
                  line,
                  currentX + cellPadding,
                  currentRowY + cellPadding + lineIndex * 3.5
                );
              });
            } else {
              // Center other cell contents vertically
              doc.text(
                cellData.toString(),
                currentX + cellPadding,
                currentRowY + requiredHeight / 2
              );
            }
            currentX += columnWidths[cellIndex];
          });

          currentRowY += requiredHeight;
        });

        // Draw remaining empty rows
        const remainingRows = 6 - borrowedItems.items.length;
        for (let i = 0; i < remainingRows; i++) {
          currentX = tableStartX;
          columns.forEach((_, index) => {
            doc.rect(currentX, currentRowY, columnWidths[index], rowHeight);
            currentX += columnWidths[index];
          });
          currentRowY += rowHeight;
        }
      }

      // Add Terms and Conditions
      currentY = tableStartY + rowHeight * 6 + 20; // Add some spacing after table
      doc.setFontSize(10);
      doc.setFont("Arial", "bold");
      doc.text("TERMS and CONDITIONS:", 20, currentY);

      currentY += 5;
      doc.setFont("Arial", "normal");
      doc.text("That I (the borrower) shall:", 20, currentY);

      // List of conditions
      currentY += 5;
      doc.text("1. Personally return", 20, currentY);
      doc.setFont("Arial", "bold");
      doc.text("IMMEDIATELY", 48.5, currentY);
      doc.setFont("Arial", "normal");
      doc.text(
        "after use the borrowed items listed above to make it/them available for",
        75.5,
        currentY
      );
      doc.text("other users.", 20, currentY + 5);

      currentY += 10;
      doc.text("2. Be held responsible for", 20, currentY);
      doc.setFont("Arial", "bold");
      doc.text("LOSS & DAMAGES", 57.5, currentY);
      doc.setFont("Arial", "normal");
      doc.text(
        "while the items are in my custody; and subsequently,",
        90.5,
        currentY
      );

      currentY += 5;
      doc.text("3. Willing to", 20, currentY);
      doc.setFont("Arial", "bold");
      doc.text("REPLACE", 38.5, currentY);
      doc.setFont("Arial", "normal");
      doc.text("the item(s) lost or damaged.", 56, currentY);

      // Note section
      currentY += 5;
      doc.setFont("Arial", "bold");
      doc.text("NOTE:", 20, currentY);

      currentY += 5;
      doc.setFont("Arial", "normal");
      doc.text("1. For instructional use of items, students are", 20, currentY);
      doc.setFont("Arial", "bold");
      doc.text("not allowed", 84.5, currentY);
      doc.setFont("Arial", "normal");
      doc.text(
        "to borrow equipment/materials for the class. The",
        103,
        currentY
      );
      doc.text(
        "instructor shall receive the item/s and sign as the borrower.",
        20,
        currentY + 5
      );

      currentY += 10;
      doc.text("2. For practice/training students shall", 20, currentY);
      doc.setFont("Arial", "bold");
      doc.text(
        "submit and present your valid school identification card",
        73.5,
        currentY
      );
      doc.setFont("Arial", "normal");
      doc.text("in borrowing", 285, currentY);
      doc.text(
        "equipment and the instructor shall also receive the item/s and sign as the borrower.",
        20,
        currentY + 5
      );

      currentY += 10;
      doc.text("3.", 20, currentY);
      doc.setFont("Arial", "bold");
      doc.text("Releasing and returning", 23, currentY);
      doc.setFont("Arial", "normal");
      doc.text("of items are within", 60, currentY);
      doc.setFont("Arial", "bold");
      doc.text(
        "school days ONLY from 8:00 in the morning to 3:00 in the",
        87.5,
        currentY
      );
      doc.text("afternoon.", 20, currentY + 5);

      // Add signature table
      currentY += 8;
      const signatureTableStartY = currentY;
      const signatureColumns = ["Borrowed by:", "Issued by:", "Noted:"];
      // Adjusted column widths to make middle column smaller
      const signatureColumnWidths = [
        (pageWidth - 40) * 0.4, // 40% for first column
        (pageWidth - 40) * 0.25, // 25% for middle column
        (pageWidth - 40) * 0.35, // 35% for last column
      ];
      const signatureRowHeight = 8; // Increased from 10 to 12

      // Draw signature table
      let signatureX = 20;

      // Draw header row with adjusted padding
      signatureColumns.forEach((header, index) => {
        doc.rect(
          signatureX,
          signatureTableStartY,
          signatureColumnWidths[index],
          signatureRowHeight
        );
        doc.setFont("Arial", "normal");
        doc.setFontSize(10);
        doc.text(header, signatureX + 4, signatureTableStartY + 5); // Adjusted Y position
        signatureX += signatureColumnWidths[index];
      });

      // Define rows and their content
      const signatureRows = [
        ["Signature:", "", ""],
        ["Name:", userDetails?.name || "", "CRISTITITO P. ORNOPIA"],
        ["Date:", "Equipment Custodian", "Coordinator, Sports Program"],
        ["Gmail:", userDetails?.email || "", ""],
      ];

      // Draw rows with adjusted positioning
      signatureRows.forEach((row, rowIndex) => {
        const y = signatureTableStartY + (rowIndex + 1) * signatureRowHeight;
        signatureX = 20;

        row.forEach((cellContent, cellIndex) => {
          doc.rect(
            signatureX,
            y,
            signatureColumnWidths[cellIndex],
            signatureRowHeight
          );

          if (cellContent) {
            if (rowIndex === 0) doc.setFont("Arial", "bold");
            else doc.setFont("Arial", "normal");

            if (cellIndex === 0) {
              // For the Gmail and Name rows, combine label and value
              if (rowIndex === 3) {
                const emailText = `Gmail: ${userDetails?.email || ""}`;
                doc.text(emailText, signatureX + 4, y + 5);
              } else if (rowIndex === 1) {
                const nameText = `Name: ${userDetails?.name || ""}`;
                doc.text(nameText, signatureX + 4, y + 5);
              } else {
                doc.text(cellContent, signatureX + 4, y + 5);
              }
            } else {
              // Don't center-align the name and email since they're now in the first column
              if (
                !(rowIndex === 3 && cellIndex === 1) &&
                !(rowIndex === 1 && cellIndex === 1)
              ) {
                const textWidth = doc.getTextWidth(cellContent);
                const centerX =
                  signatureX +
                  signatureColumnWidths[cellIndex] / 2 -
                  textWidth / 2;
                doc.text(cellContent, centerX, y + 5);
              }
            }
          }
          signatureX += signatureColumnWidths[cellIndex];
        });
      });
    };

    // Update the content section
    header();
    mainContent();
    footer();

    if (preview) {
      // Create blob URL for preview
      const pdfBlob = doc.output("blob");
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
    } else {
      doc.save("borrowers-slip.pdf");
    }
  };

  // Generate preview when component mounts
  useEffect(() => {
    generatePDF(true);

    // Cleanup blob URL on unmount
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[90%] max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Borrower's Slip Preview
          </h2>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* PDF Preview Container */}
          <div className="bg-gray-100 p-4 rounded-lg min-h-[500px] flex items-center justify-center">
            {pdfUrl ? (
              <iframe
                src={pdfUrl}
                className="w-full h-[500px] border-0"
                title="PDF Preview"
              />
            ) : (
              <div className="text-center">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-gray-600 mb-4">Loading preview...</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 rounded border border-gray-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
            aria-label="Close modal"
          >
            Close
          </button>
          <button
            onClick={() => generatePDF(false)}
            className="px-4 py-2 bg-secondary text-white rounded focus:outline-none flex items-center"
            aria-label="Download PDF"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentBorrowerSlipPreview;
