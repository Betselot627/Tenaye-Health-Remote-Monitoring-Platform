/**
 * Test Script for Appointment Timing Logic
 * Run with: node test-appointment-timing.js
 */

// Simulate an appointment scheduled for 2:00 PM today
const now = new Date();
const scheduledTime = new Date(now);
scheduledTime.setHours(14, 0, 0, 0); // 2:00 PM today

console.log('=== APPOINTMENT TIMING TEST ===\n');
console.log('Current Time:', now.toLocaleString());
console.log('Scheduled Time:', scheduledTime.toLocaleString());
console.log('');

// Calculate call window
const scheduledTimeMs = scheduledTime.getTime();
const nowMs = now.getTime();
const callWindowStartMs = scheduledTimeMs - 15 * 60 * 1000; // 15 min before
const callWindowEndMs = scheduledTimeMs + 30 * 60 * 1000; // 30 min after

const callWindowStart = new Date(callWindowStartMs);
const callWindowEnd = new Date(callWindowEndMs);

console.log('Call Window:');
console.log('  Opens at:', callWindowStart.toLocaleTimeString());
console.log('  Closes at:', callWindowEnd.toLocaleTimeString());
console.log('');

// Check current status
const canJoinCall = nowMs >= callWindowStartMs && nowMs <= callWindowEndMs;
const isTooEarly = nowMs < callWindowStartMs;
const isTooLate = nowMs > callWindowEndMs;

console.log('Current Status:');
if (canJoinCall) {
  const minutesRemaining = Math.ceil((callWindowEndMs - nowMs) / 60000);
  console.log('  ✅ CAN JOIN CALL');
  console.log(`  ⏰ Window closes in ${minutesRemaining} minutes`);
} else if (isTooEarly) {
  const minutesUntilCall = Math.ceil((callWindowStartMs - nowMs) / 60000);
  console.log('  ⏳ TOO EARLY');
  console.log(`  ⏰ Available in ${minutesUntilCall} minutes`);
} else if (isTooLate) {
  const minutesSinceEnd = Math.ceil((nowMs - callWindowEndMs) / 60000);
  console.log('  ❌ TOO LATE');
  console.log(`  ⏰ Window closed ${minutesSinceEnd} minutes ago`);
}
console.log('');

// Test different scenarios
console.log('=== TEST SCENARIOS ===\n');

const scenarios = [
  { name: '20 minutes before', offset: -20 },
  { name: '15 minutes before (window opens)', offset: -15 },
  { name: '10 minutes before', offset: -10 },
  { name: 'Exactly at scheduled time', offset: 0 },
  { name: '10 minutes after', offset: 10 },
  { name: '30 minutes after (window closes)', offset: 30 },
  { name: '35 minutes after', offset: 35 },
];

scenarios.forEach(({ name, offset }) => {
  const testTime = scheduledTimeMs + (offset * 60 * 1000);
  const canJoin = testTime >= callWindowStartMs && testTime <= callWindowEndMs;
  const status = canJoin ? '✅ CAN JOIN' : '❌ CANNOT JOIN';
  console.log(`${name}: ${status}`);
});

console.log('');
console.log('=== TIMEZONE INFO ===\n');
console.log('System Timezone:', Intl.DateTimeFormat().resolvedOptions().timeZone);
console.log('UTC Offset:', -now.getTimezoneOffset() / 60, 'hours');
console.log('');
console.log('Scheduled Time (UTC):', scheduledTime.toISOString());
console.log('Scheduled Time (Local):', scheduledTime.toLocaleString());
console.log('');

// Test the error message format
if (isTooEarly) {
  const minutesUntilAvailable = Math.ceil((callWindowStartMs - nowMs) / 60000);
  console.log('=== ERROR MESSAGE TEST ===\n');
  console.log('OLD (WRONG):');
  console.log(`  "Call will be available ${minutesUntilAvailable} minutes before the scheduled time."`);
  console.log('  ^ This is confusing! Does it mean 357 minutes before 2:00 PM?');
  console.log('');
  console.log('NEW (CORRECT):');
  console.log(`  "Call will be available in ${minutesUntilAvailable} minutes (15 minutes before scheduled time)."`);
  console.log('  ^ This is clear! The call opens in X minutes from now.');
  console.log('');
}

console.log('=== TEST COMPLETE ===');
