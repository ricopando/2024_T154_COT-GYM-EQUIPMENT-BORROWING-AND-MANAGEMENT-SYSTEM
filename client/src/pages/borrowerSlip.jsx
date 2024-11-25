import React, { useRef, useState } from "react";


const BorrowersSlip = ({ selectedItems, userDetails }) => {
  console.log("Received selectedItems in BorrowersSlip:", selectedItems);
  const slipRef = useRef();



  return (
    <div className="container" ref={slipRef} style={containerStyle}>
      <div className="header" style={headerStyle}>
        <div className="box" style={boxStyle}>
          <img 
            style={imageStyle} 
            src="https://th.bing.com/th/id/OIP.081z0bkyijEfgDcNKjeS5AHaHa?rs=1&pid=ImgDetMain" 
            alt="Bukidnon State University Logo"
          />
          <div className="header-content" style={headerContentStyle}>
            <h1 style={headingStyle}>BUKIDNON STATE UNIVERSITY</h1>
            <p style={paragraphStyle}>Fortich Street, Malaybalay City, Bukidnon 8700</p>
            <p style={paragraphStyle}>
              Tel: (088) 813-5661 to 5663 | Telefax: (088) 813-2717 |{' '}
              <a href="http://www.buksu.edu.ph" target="_blank" rel="noopener noreferrer">www.buksu.edu.ph</a>
            </p>
          </div>
        </div>
      </div>
      <hr style={{ border: '1px solid black' }} />
      <p style={centerTextStyle}><strong>OFFICE OF THE SPORTS PROGRAM</strong></p>
      <p style={centerTextStyle}><strong>BORROWER’S SLIP</strong></p>
      <div className="flex flex-wrap" style={{ fontSize: '12px' }}>
        {['Coach/Trainer', 'Athlete', 'Regular Student', 'BukSU Personnel', 'P.E. Instructor'].map((label, index) => (
          <label key={index} className="mr-4 flex items-center text-sm">
            <input type="checkbox" name="category" value={label.toLowerCase().replace(/ /g, '-')} className="mr-2 w-4 h-4" /> {label}
          </label>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label style={{ marginRight: '10px' }}>
          <input type="checkbox" name="category" value="others" />Others (Office/Agency): ________________________________________.
        </label>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ marginRight: '10px' }}>
            <input type="checkbox" name="category" value="custodian" />
            For Custodian: ________________________________________.
            <p style={{ fontSize: '12px', lineHeight: '1.2', margin: '0' }}>
            Availability of Equipment:
            <label style={{ marginRight: '10px' }}>
              <input type="checkbox" name="availability" value="yes" /> YES
            </label>
            <label style={{ marginRight: '10px' }}>
              <input type="checkbox" name="availability" value="no" /> NO
            </label>
            </p>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ marginRight: '10px' }}>
                <input type="checkbox" name="category" value="borrower" />
                For Borrower: ________________________________________.
                <p style={{ fontSize: '12px', lineHeight: '1.2', margin: '0' }}>
                  I acknowledge to have received from the OFFICE OF SPORTS PROGRAM of Bukidnon State University the following:
                  </p>
              </label>
            </div>
          </label>
        </div>
      </div>
      <table style={tableStyle}>
        <thead>
          <tr>
            {['Name','Category', 'Time/Date (Start)', 'Time/Date (Expected to return)', 'Time/Date (Returned)', 'Remarks'].map((header, index) => (
              <th key={index} style={tableHeaderStyle}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
        {selectedItems && selectedItems.length > 0 ? (
  selectedItems.map((item, index) => (
    <tr key={index}>
      <td style={tableCellStyle}>{item.equipment?.name}</td>
      <td style={tableCellStyle}>{item.equipment?.category}</td>
      <td style={tableCellStyle}>{item.borrowDate}</td>
      <td style={tableCellStyle}>{item.returnDate}</td>
      <td style={tableCellStyle}>{item.DueDate}</td>
      <td style={tableCellStyle}>{item.remarks}</td>
    </tr>
  ))
) : (
  <tr>
    <td colSpan={6} style={{ textAlign: 'center' }}>No items selected</td>
  </tr>
)}
        </tbody>
      </table>
      <div className="terms" style={termsStyle}>
        <p style={{ margin: '0' }}><strong>Terms and Conditions:</strong></p>
        <p style={{ margin: '0' }}>That I (the borrower) shall:</p>
        <p style={{ margin: '0' }}>1. Personally return <strong>IMMEDIATELY</strong> after use the borrowed items listed above to make it/them available for other users.</p>
        <p style={{ margin: '0' }}>2. Be held responsible for <strong>LOSS & DAMAGES</strong> while the items are in my custody; and subsequently,</p>
        <p style={{ margin: '0' }}>3. Willing to <strong>REPLACE</strong> the item(s) lost or damaged.</p>
        <p style={{ margin: '0' }}><strong>Note:</strong></p>
        <p style={{ margin: '0' }}>1.For instructional use, students are <strong>not allowed</strong> to borrow equipment/materials for the class. The instructor shall receive the item/s and sign as the borrower.</p>
        <p style={{ margin: '0' }}>2.For practice/training, students shall submit and present your valid school identification card in borrowing equipment, and the instructor shall also receive the item/s and sign as the borrower.</p>
        <p style={{ margin: '0' }}>3.Releasing and returning of items are within school days <strong>ONLY</strong> from <strong>8:00 AM to 3:00 PM</strong>.</p>
      </div>
      <table style={tableStyle}>
    <thead>
      <tr>
        {['', 'Borrowed by:', 'Issued by:', 'Noted:'].map((header, index) => (
          <th key={index} style={tableHeaderStyle}>{header}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {['Signature', 'Name', 'Date:', 'Gmail'].map((rowTitle, rowIndex) => (
        <tr key={rowIndex}>
          <td style={tableCellStyle}>{rowTitle}</td>
          {[...Array(3)].map((_, cellIndex) => (
            <td key={cellIndex} style={tableCellStyle}>
              {rowTitle === 'Name' && cellIndex === 0 ? userDetails?.name || 'N/A' : ''}
              {rowTitle === 'Gmail' && cellIndex === 0 ? userDetails?.email || 'N/A' : ''}
              {rowTitle === 'Name' && cellIndex === 2 ? 'CRISTITITO P. ORNOPIA' : ''}
              {rowTitle === 'Date:' && cellIndex === 1 ? 'Equipment Custodian' : ''}
              {rowTitle === 'Date:' && cellIndex === 2 ? 'Sports Program Officer III' : ''}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
     
      
    </div>
  );
};

const containerStyle = {
  width: '210mm',
  height: '297mm',
  margin: 'auto',
  padding: '20mm',
  boxSizing: 'border-box',
  border: '1px solid #ddd',
 
};

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
};

const boxStyle = {
  marginBottom: '0',
  display: 'flex',
  alignItems: 'center',
};

const imageStyle = {
  marginRight: '60px',
  width: '80px',
  height: '80px',
  borderRadius: '50%',
};

const headerContentStyle = {
  textAlign: 'center',
};

const headingStyle = {
  fontSize: '22px',
  margin: '0',
  color: '#333',
};

const paragraphStyle = {
  margin: '5px 0',
  fontSize: '12px',
  color: '#000',
};

const centerTextStyle = {
  textAlign: 'center',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginBottom: '20px',
  fontSize: '10px',

  margin: '0 auto',
};

const tableHeaderStyle = {
  border: '1px solid #ccc',
  textAlign: 'left',
  backgroundColor: '#f4f4f4',
};

const tableCellStyle = {
  border: '1px solid #ccc',
  padding: '5px',
  textAlign: 'left',
};

const termsStyle = {
  fontSize: '12px',
  lineHeight: '1.2',
  color: '#555',
  margin: '0',
  padding: '0',
};

const footerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '20%',
  fontSize: '12px',
  textAlign: 'center',
  color: '#666',
};

const downloadButtonStyle = {
  padding: '10px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  marginTop: '50px',
};

export default BorrowersSlip;
