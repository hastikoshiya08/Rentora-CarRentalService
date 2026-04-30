import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../assets/BMC-logo.png";
import signature from "../assets/my-signature.png";

const generateInvoice = (booking, user) => {
  const doc = new jsPDF();
  
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN");


  if (logo) {
    doc.addImage(logo, "PNG", 14, 10, 35, 20);
  }
 
  doc.setFontSize(22);
  doc.setTextColor(40, 40, 80);
  doc.text("Booking Invoice", 105, 22, null, null, "center");

  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Invoice Date: ${formatDate(new Date())}`, 14, 38);
  doc.text(`Booking ID: ${booking.id}`, 14, 44);

  doc.setDrawColor(180);
  doc.line(14, 48, 196, 48);

  doc.setFontSize(13);
  doc.setTextColor(33, 33, 33);
  doc.text("Customer Details", 14, 56);

autoTable(doc, {
  startY: 60,
  head: [["Name", "Phone", "Email"]],
  body: [[
    booking.customer || "N/A",
    booking.phone || "N/A",
    booking.email || "N/A",
  ]],
});

  //Booking Details
  const afterCustomer = doc.lastAutoTable.finalY || 70;

  doc.text("Booking Details", 14, afterCustomer + 10);

  autoTable(doc, {
    startY: afterCustomer + 14,
    head: [["Car Variant", "From", "To", "Days"]],
    body: [[
      booking.carVariant,
      formatDate(booking.fromDate),
      formatDate(booking.toDate),
      booking.totalDays,
    ]],
    headStyles: { fillColor: [39, 174, 96] },
  });

  //Payment Summary
  const afterBooking = doc.lastAutoTable.finalY || 100;

  doc.text("Payment Summary", 14, afterBooking + 10);

  autoTable(doc, {
    startY: afterBooking + 14,
    body: [
      ["Booking Amount", `Rs. ${booking.price}`],
      ["Payment Status", booking.paymentStatus],
      ["Admin Approval", booking.approvalStatus],
      ["Booking Time", booking.bookingTime],
    ],
  });


  //Total Highlight
  const totalY = doc.lastAutoTable.finalY + 10;

  doc.setFillColor(230, 230, 250);
  doc.rect(14, totalY, 182, 10, "F");

  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(`Total Payable: Rs. ${booking.price}`, 16, totalY + 7);


  //Signature
  if (signature) {
    doc.text("Authorized Signature:", 14, 275);
    doc.addImage(signature, "PNG", 50, 263, 40, 20);
  }

  doc.setFontSize(10);
  doc.text("Thank you for choosing Rentora!", 14, 285);

  doc.save(`Invoice_${booking.id}.pdf`);
};

export default generateInvoice;