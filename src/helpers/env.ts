import * as dotenv from 'dotenv'
import { cleanEnv, str, num } from 'envalid'
import { cwd } from 'process'
import { resolve } from 'path'

dotenv.config({ path: resolve(cwd(), '.env') })

// eslint-disable-next-line node/no-process-env
export default cleanEnv(process.env, {
    TOKEN: str(),
    SENTRY_DSN: str({ default: undefined }),
    I_NEED_HELP_CHANNEL_ID: num(),
    I_WANT_TO_HELP_CHANNEL_ID: num(),
    I_WANT_TO_ASK_CHANNEL_ID: num(),
})
