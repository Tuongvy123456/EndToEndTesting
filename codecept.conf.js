import { setHeadlessWhen } from '@codeceptjs/configure';

setHeadlessWhen(process.env.HEADLESS);

export const config = {
  tests: './tests/*.ts',
  output: './output',
  helpers: {
    Playwright: {
      url: 'http://localhost:5173',
      show: true,
      browser: 'chromium',
    }
  },
  include: {
    I: './steps_file.ts'
  },
  name: 'project'
}
