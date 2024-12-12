import { jsPDF } from 'jspdf';
import React from 'react';
const Form = () => {
    
    const generatePDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const marginTop = 5;
        const marginBottom = 20;

        // Updated header function
        const header = () => {
            const imageUrl = 'https://th.bing.com/th/id/OIP.081z0bkyijEfgDcNKjeS5AHaHa?rs=1&pid=ImgDetMain';
            const imageWidth = 25;
            const imageHeight = 25;
            const startX = 20;
            const startY = marginTop ;

            // Add image
            doc.addImage(imageUrl, 'PNG', startX, startY, imageWidth, imageHeight);

            // Center align all text
            const centerX = pageWidth / 2;
            
            // Add text centered
            doc.setFont('Arial', 'bold');
            doc.setFontSize(12);
            doc.text('BUKIDNON STATE UNIVERSITY', centerX, startY + 8, { align: 'center' });
            
            doc.setFont('Arial', 'normal');
            doc.setFontSize(10);
            doc.text('Fortich Street, Malaybalay City, Bukidnon 8700', centerX, startY + 14, { align: 'center' });
            
            // Contact information and website on one line
            const contactText = 'Tel (088) 813-5661 to 5663; Telefax (088) 813-2717, ';
            const websiteText = 'www.buksu.edu.ph';
            
            // Calculate total width for centering
            const totalWidth = doc.getTextWidth(contactText + websiteText);
            const startTextX = centerX - (totalWidth / 2);
            
            // Add contact info
            doc.text(contactText, startTextX, startY + 20);
            
            // Add website with blue color and underline
            doc.setTextColor(0, 0, 255);
            doc.textWithLink(websiteText, startTextX + doc.getTextWidth(contactText), startY + 20, {
                url: 'http://www.buksu.edu.ph'
            });
            
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
            doc.text(`Document Code: OSP-F-001          Revision No: 0            Issue No. 1           Issue Date: 4/23/2021             Page 1of1  ${pageCount}`, pageWidth / 2, startY, { align: 'center' });
        };

        const mainContent = () => {
            const startY = marginTop + 35;
            const lineHeight = 7;
            let currentY = startY;

            // Title
            doc.setFont('Arial', 'bold');
            doc.setFontSize(12);
            doc.text('OFFICE OF THE SPORTS PROGRAM', pageWidth / 2, currentY, { align: 'center' });
            
            currentY += lineHeight + 3;
            doc.setFontSize(11);
            doc.text("BORROWER'S SLIP", pageWidth / 2, currentY, { align: 'center' });
            
            // Checkboxes and labels with adjusted spacing
            currentY += lineHeight; // Increased spacing after title
            doc.setFont('Arial', 'normal');
            doc.setFontSize(10);
            
            const startX = 20; // Moved start position to the right
            const checkboxSize = 4;
            const labelSpacing = 35; // Increased spacing between checkbox groups

            // Draw checkboxes and labels with more spacing
            const categories = [
                'Coach/Trainer', 'Athlete', 'Regular Student', 
                'BukSU Personnel', 'P.E. Instructor'
            ];

            categories.forEach((label, index) => {
                const xPos = startX + (index * labelSpacing);
                // Draw checkbox
                doc.rect(xPos, currentY - 3, checkboxSize, checkboxSize);
                // Add label with more spacing
                doc.text(label, xPos + checkboxSize + 2, currentY);
            });

            // Others field with more spacing
        
            currentY += lineHeight + 2;
            doc.setFont('Arial', 'bold');
            doc.rect(startX, currentY - 3, checkboxSize, checkboxSize);
            doc.text('Others (Office/Agency):', startX + checkboxSize + 1, currentY);
            doc.line(startX + 42, currentY, pageWidth - 80, currentY);

            // For Custodian field with adjusted spacing
            currentY += lineHeight + 2;
            
            doc.text('For Custodian:', startX, currentY);
            doc.line(startX + 24, currentY, pageWidth - 100, currentY);
            doc.setFont('Arial', 'normal');
            currentY += lineHeight-2;
            doc.text('Availability of Equipment :', startX, currentY);
            // Yes checkbox
            doc.rect(pageWidth - 148, currentY - 3, checkboxSize, checkboxSize);
            doc.text('YES', pageWidth - 143, currentY);
            // No checkbox
            doc.rect(pageWidth - 130, currentY - 3, checkboxSize, checkboxSize);
            doc.text('NO', pageWidth - 125, currentY);

            // For Borrower field
            currentY += lineHeight ;
            doc.setFont('Arial', 'bold');
            doc.text('For Borrower:', startX, currentY);
            doc.line(startX + 24, currentY, pageWidth - 100, currentY);

            // Acknowledgment text with adjusted spacing
            currentY += lineHeight -3;
            const acknowledgmentY = currentY;
            doc.setFont('Arial', 'normal');
            doc.text('I acknowledge to have received from the', startX, acknowledgmentY);
            doc.setFont('Arial', 'bold');
            doc.text('OFFICE OF SPORTS PROGRAM', startX + 58.5, acknowledgmentY);
            doc.setFont('Arial', 'normal');
            doc.text('of', startX + 112.5, acknowledgmentY);
            doc.setFont('Arial', 'bold');
            doc.text('Bukidnon State', startX + 116.5, acknowledgmentY);
            
            currentY += lineHeight-3;
            doc.text('University', startX, currentY);
            doc.setFont('Arial', 'normal');
            doc.text('the following:', startX + 16.5, currentY);

            // Add table
            currentY += lineHeight-3;
            const tableStartY = currentY;
            const columns = ['SERIAL #', 'NAME', 'BORROW DATE', 'RETURN DATE', 'RETURNED'];
            const columnWidths = [20, 30, 40, 40, 40];
            const cellPadding = 3;
            const rowHeight = 8;

            // Calculate starting X position for the table to center it
            const tableWidth = columnWidths.reduce((sum, width) => sum + width, 0);
            const tableStartX = (pageWidth - tableWidth) / 2;

            // Draw table headers
            let currentX = tableStartX;
            doc.setFont('Arial', 'bold');
            doc.setFontSize(9);

            // Draw header cells
            columns.forEach((header, index) => {
                doc.rect(currentX, tableStartY, columnWidths[index], rowHeight);
                doc.text(header, currentX + cellPadding, tableStartY + 5);
                currentX += columnWidths[index];
            });

            // Draw 5 empty rows
            for (let i = 0; i < 5; i++) {
                currentX = tableStartX;
                columns.forEach((_, index) => {
                    doc.rect(currentX, tableStartY + (rowHeight * (i + 1)), columnWidths[index], rowHeight);
                    currentX += columnWidths[index];
                });
            }

            // Add Terms and Conditions
            currentY = tableStartY + (rowHeight * 6) + 5; // Add some spacing after table
            doc.setFontSize(10);
            doc.setFont('Arial', 'bold');
            doc.text('TERMS and CONDITIONS:', 20, currentY);
            
            currentY += 5;
            doc.setFont('Arial', 'normal');
            doc.text('That I (the borrower) shall:', 20, currentY);

            // List of conditions
            currentY += 5;
            doc.text('1. Personally return', 20, currentY);
            doc.setFont('Arial', 'bold');
            doc.text('IMMEDIATELY', 48.5, currentY);
            doc.setFont('Arial', 'normal');
            doc.text('after use the borrowed items listed above to make it/them available for', 75.5, currentY);
            doc.text('other users.', 20, currentY + 5);

            currentY += 10;
            doc.text('2. Be held responsible for', 20, currentY);
            doc.setFont('Arial', 'bold');
            doc.text('LOSS & DAMAGES', 57.5, currentY);
            doc.setFont('Arial', 'normal');
            doc.text('while the items are in my custody; and subsequently,', 90.5, currentY);

            currentY += 5;
            doc.text('3. Willing to', 20, currentY);
            doc.setFont('Arial', 'bold');
            doc.text('REPLACE', 38.5, currentY);
            doc.setFont('Arial', 'normal');
            doc.text('the item(s) lost or damaged.', 56, currentY);

            // Note section
            currentY += 5;
            doc.setFont('Arial', 'bold');
            doc.text('NOTE:', 20, currentY);

            currentY += 5;
            doc.setFont('Arial', 'normal');
            doc.text('1. For instructional use of items, students are', 20, currentY);
            doc.setFont('Arial', 'bold');
            doc.text('not allowed', 84.5, currentY);
            doc.setFont('Arial', 'normal');
            doc.text('to borrow equipment/materials for the class. The', 103, currentY);
            doc.text('instructor shall receive the item/s and sign as the borrower.', 20, currentY + 5);

            currentY += 10;
            doc.text('2. For practice/training students shall', 20, currentY);
            doc.setFont('Arial', 'bold');
            doc.text('submit and present your valid school identification card', 73.5, currentY);
            doc.setFont('Arial', 'normal');
            doc.text('in borrowing', 285, currentY);
            doc.text('equipment and the instructor shall also receive the item/s and sign as the borrower.', 20, currentY + 5);

            currentY += 10;
            doc.text('3.', 20, currentY);
            doc.setFont('Arial', 'bold');
            doc.text('Releasing and returning', 23, currentY);
            doc.setFont('Arial', 'normal');
            doc.text('of items are within', 60, currentY);
            doc.setFont('Arial', 'bold');
            doc.text('school days ONLY from 8:00 in the morning to 3:00 in the', 87.5, currentY);
            doc.text('afternoon.', 20, currentY + 5);
        };

        // Update the content section
        header();
        mainContent();
        footer();

        doc.save('borrowers-slip.pdf');
    };

    return (
        <div className="flex justify-center items-center h-screen p-4">
            <button 
                onClick={generatePDF} 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 mt-4 mx-4"
                aria-label="Generate PDF"
            >
                Download PDF
            </button>
        </div>
    );
};

export default Form;

