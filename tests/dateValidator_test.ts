Feature('Date Validator');

Scenario('Validate a correct date using separate fields', async ({ I }) => {
  I.amOnPage('/');
  I.see('Date Validator');
  I.see('Separate Fields');
  I.fillField({ css: '.grid > div:nth-of-type(1) input' }, '29');  // Day
  I.fillField({ css: '.grid > div:nth-of-type(2) input' }, '2');   // Month
  I.fillField({ css: '.grid > div:nth-of-type(3) input' }, '2024'); // Year
  I.see('Valid date! This is a Thursday.');
  I.see('Leap Year');
  I.see('29 days in month');
});

Scenario('Validate an invalid date using separate fields', async ({ I }) => {
  I.amOnPage('/');
  I.see('Date Validator');
  I.see('Separate Fields');
  I.fillField({ css: '.grid > div:nth-of-type(1) input' }, '31');  // Day
  I.fillField({ css: '.grid > div:nth-of-type(2) input' }, '2');   // Month
  I.fillField({ css: '.grid > div:nth-of-type(3) input' }, '2023'); // Year
  I.see('Day must be between 1 and 28 for February 2023');
});

Scenario('Switch to single field and validate correct date', async ({ I }) => {
  I.amOnPage('/');
  I.click('Single Field');
  I.fillField({ css: 'input[type="text"]' }, '2024-03-15');
  I.see('Valid date! This is a Friday.');
  I.see('Leap Year');
  I.see('31 days in month');
});

Scenario('Switch to single field and validate invalid date format', async ({ I }) => {
  I.amOnPage('/');
  I.click('Single Field');
  I.fillField({ css: 'input[type="text"]' }, '15/15/2024');
  I.see('Month must be between 1 and 12');
}); 