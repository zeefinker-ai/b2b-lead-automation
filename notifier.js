export async function sendNotification(company, pitch) {
  try {
    const message = `🎯 New Lead Found!\n\nCompany: ${company}\n\nPitch: ${pitch}`;
    await fetch('https://ntfy.sh/b2bleads-zeefinker', {
      method: 'POST',
      body: message
    });
    console.log('📱 Notification sent!');
  } catch (error) {
    console.error('❌ Notification error:', error.message);
  }
}
