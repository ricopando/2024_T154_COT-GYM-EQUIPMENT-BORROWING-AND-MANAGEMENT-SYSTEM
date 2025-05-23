import BorrowedItem from '../models/borrowedItem.js';
import transporter from './mailer.js';

const sendReturnReminders = async () => {
  try {
    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Find all borrowed items with at least one item due today and not returned
    const borrowedItems = await BorrowedItem.find({
      'items.returnDate': { $gte: today, $lt: tomorrow },
      'items.status': { $ne: 'Returned' },
    })
      .populate('user', 'displayName email')
      .populate('items.equipment', 'name serialNumber');

    // Group due items by user
    const userDueMap = new Map();
    borrowedItems.forEach((borrowedItem) => {
      const user = borrowedItem.user;
      if (!user || !user.email) return;
      // Find all items in this borrowedItem due today and not returned
      const dueItems = borrowedItem.items.filter(
        (item) =>
          item.status !== 'Returned' &&
          item.returnDate >= today &&
          item.returnDate < tomorrow
      );
      if (dueItems.length === 0) return;
      if (!userDueMap.has(user.email)) {
        userDueMap.set(user.email, {
          user,
          items: [],
        });
      }
      userDueMap.get(user.email).items.push(
        ...dueItems.map((item) => ({
          equipment: item.equipment,
          borrowDate: item.borrowDate,
          returnDate: item.returnDate,
        }))
      );
    });

    // Send email to each user
    for (const [email, { user, items }] of userDueMap.entries()) {
      const equipmentList = items
        .map(
          (item) =>
            `- ${item.equipment.name} (Serial: ${item.equipment.serialNumber})
  Borrowed: ${item.borrowDate.toLocaleDateString()}
  Return: ${item.returnDate.toLocaleDateString()}`
        )
        .join('\n\n');

      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Equipment Return Reminder',
        text: `Dear ${user.displayName},

This is a friendly reminder that the following equipment you borrowed is due for return today (${today.toLocaleDateString()}):

${equipmentList}

Please return the equipment to the gym as soon as possible.

Thank you,
Gym Equipment Management System`,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Reminder sent to ${email}`);
    }
  } catch (error) {
    console.error('Error sending return reminders:', error);
  }
};

export default sendReturnReminders;