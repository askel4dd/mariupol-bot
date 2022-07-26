# pylint: disable=unused-argument, wrong-import-position
import logging, os
import yaml
import os

from telegram import __version__ as TG_VER, InlineKeyboardButton, InlineKeyboardMarkup

try:
    from telegram import __version_info__
except ImportError:
    __version_info__ = (0, 0, 0, 0, 0)  # type: ignore[assignment]

if __version_info__ < (20, 0, 0, "alpha", 1):
    raise RuntimeError(
        f"This example is not compatible with your current PTB version {TG_VER}. To view the "
        f"{TG_VER} version of this example, "
        f"visit https://docs.python-telegram-bot.org/en/v{TG_VER}/examples.html"
    )
from telegram import ReplyKeyboardMarkup, ReplyKeyboardRemove, Update
from telegram.ext import (
    Application,
    CommandHandler,
    ContextTypes,
    ConversationHandler,
    MessageHandler,
    filters, CallbackQueryHandler, PicklePersistence,
)

# Enable logging
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO
)
logger = logging.getLogger(__name__)

path = os.path.dirname(os.path.abspath(__file__))
locale_path = os.path.normpath(os.path.join(path, '..', 'locales', 'ru.yaml'))

with open(locale_path, 'rt') as stream:
    _locale_data = yaml.safe_load(stream)


def _(key):
    global _locale_data
    path = key.split('.')
    current = _locale_data
    for key in path:
        current = current[key]
    return current


WHAT_YOU_WANT, I_WANT_TO_HELP, FEEDBACK_MODE, RESTART, I_NEED_HELP, COUNTRY_SWITCH, LEAVE_RUSSIA, \
ESTONIA_SWITCH, PROTECTION_SWITCH, HELP_IN_ESTONIA_SWITCH, QUESTIONNAIRE_SWITCH, NEW_USER, EXISTING_USER, \
ACTION_SWITCH, TICKET_EDIT, EMERGENCY, NEW_USER_ASK_FOR_LAST_NAME, NEW_USER_ASK_FOR_DETAILS = range(18)


def get_restart_markup():
    keyboard = [
        [
            InlineKeyboardButton(_('restart_menu'), callback_data='restart'),
        ]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    return reply_markup


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Starts the conversation and asks the user about their gender."""

    keyboard = [
        [
            InlineKeyboardButton(_('i_need_help_button'), callback_data='i_need_help_button'),
        ], [
            InlineKeyboardButton(_('i_want_to_help_button'), callback_data='i_want_to_help_button'),
        ]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text(_('what_you_want'), reply_markup=reply_markup)

    return WHAT_YOU_WANT


async def i_need_help(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    query = update.callback_query
    await query.answer()
    keyboard = [
        [InlineKeyboardButton(_('i_need_help_wizard.country_russia'), callback_data='country_russia')],
        [InlineKeyboardButton(_('i_need_help_wizard.country_ukraine'), callback_data='country_ukraine')],
        [InlineKeyboardButton(_('i_need_help_wizard.country_estonia'), callback_data='country_estonia')],
        [InlineKeyboardButton(_('i_need_help_wizard.country_latvia'), callback_data='country_latvia')],
        [InlineKeyboardButton(_('i_need_help_wizard.country_other'), callback_data='country_other')],
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await query.message.reply_text(_('i_need_help_wizard.intro'))
    await query.message.reply_text(_('i_need_help_wizard.country_switch'), reply_markup=reply_markup)
    return COUNTRY_SWITCH


async def i_want_to_help(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    query = update.callback_query
    await query.answer()
    keyboard = [
        [InlineKeyboardButton(_('i_want_to_help.i_volunteer'), callback_data='want_to_help__volunteer')],
        [InlineKeyboardButton(_('i_want_to_help.want_to_give_feedback'), callback_data='want_to_help__feedback')],
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await query.message.reply_text(_('how_you_want_to_help'), reply_markup=reply_markup)
    return I_WANT_TO_HELP


async def i_want_to_help__volunteer(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    await query.message.reply_text(
        _('i_want_to_help.volunteer.ask_volunteer_form'),
        parse_mode='HTML',
        reply_markup=get_restart_markup(),
        disable_web_page_preview=True,
    )
    return RESTART


async def i_want_to_help__feedback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    await query.message.reply_text(
        _('i_want_to_help.feedback.ask_for_feedback')
    )
    return FEEDBACK_MODE


async def feedback_questionnaire(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = update.message.text
    user = update.message.from_user

    channel_text = (
        f'{text or ""}\n'
        f'User ID: {user.id}\n'
        f'Username: @{user.username}\n'
        f'Профиль: <a href="tg://user?id={user.id}">{user.username or user.id}</a>\n'
        f'#feedback'
    )
    await update.message.get_bot().send_message(
        os.environ['I_WANT_TO_HELP_CHANNEL_ID'],
        channel_text,
        parse_mode='HTML',
    )

    await update.message.reply_text(_('i_want_to_help.volunteer.thanks'), reply_markup=get_restart_markup())
    return RESTART


async def country_other(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    await query.message.reply_text(_('i_need_help_wizard.reply_other'), reply_markup=get_restart_markup())
    return RESTART


async def country_latvia(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    await query.message.reply_text(_('i_need_help_wizard.reply_latvia'), reply_markup=get_restart_markup())
    return RESTART


async def country_ukraine(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    await query.message.reply_text(
        _('i_need_help_wizard.reply_ukraine'),
        parse_mode='HTML',
        reply_markup=get_restart_markup()
    )
    return RESTART


async def country_russia(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    keyboard = [
        [
            InlineKeyboardButton(_('yes'), callback_data='yes'),
        ],
        [
            InlineKeyboardButton(_('no'), callback_data='no'),
        ]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await query.message.reply_text(
        _('i_need_help_wizard.do_you_know_how_to_leave_russia'),
        reply_markup=reply_markup
    )
    return LEAVE_RUSSIA


async def help_in_russia(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    await query.message.reply_text(
        _('i_need_help_wizard.help_in_russia'),
        parse_mode='HTML',
        reply_markup=get_restart_markup()
    )
    return RESTART


async def country_estonia(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    keyboard = [
        [
            InlineKeyboardButton(_('yes'), callback_data='yes'),
        ],
        [
            InlineKeyboardButton(_('i_need_help_wizard.go_to_other_country'), callback_data='no'),
        ]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await query.message.reply_text(
        _('i_need_help_wizard.estonia_stay_question'),
        reply_markup=reply_markup
    )
    return ESTONIA_SWITCH


async def ask_about_protection(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    keyboard = [
        [
            InlineKeyboardButton(_('yes'), callback_data='yes'),
        ],
        [
            InlineKeyboardButton(_('no'), callback_data='no'),
        ]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await query.message.reply_text(
        _('i_need_help_wizard.protection_question'),
        reply_markup=reply_markup
    )
    return PROTECTION_SWITCH


async def protection_yes(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    await query.message.reply_text(
        _('i_need_help_wizard.estonia_final'),
        parse_mode='HTML',
        reply_markup=get_restart_markup(),
        disable_web_page_preview=True,
    )
    return RESTART


async def protection_no(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    keyboard = [
        [
            InlineKeyboardButton(_('i_need_help_wizard.protection.everything_is_ok'), callback_data='ok'),
        ],
        [
            InlineKeyboardButton(_('i_need_help_wizard.protection.help_me'), callback_data='help'),
        ]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await query.message.reply_text(
        _('i_need_help_wizard.estonia_protect_me'),
        reply_markup=reply_markup
    )
    return HELP_IN_ESTONIA_SWITCH


async def everything_is_ok(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    await query.message.reply_text(_('i_need_help_wizard.final_no_contact'), reply_markup=get_restart_markup())
    return RESTART


async def go_further(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    keyboard = [
        [
            InlineKeyboardButton(_('yes'), callback_data='yes'),
        ],
        [
            InlineKeyboardButton(_('no'), callback_data='no'),
        ]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await query.message.reply_text(
        _('i_need_help_wizard.questionnaire.question'),
        reply_markup=reply_markup
    )
    return QUESTIONNAIRE_SWITCH


async def new_user(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    await query.message.reply_text(
        _('i_need_help_wizard.questionnaire.new_user.prompt'),
        parse_mode='HTML',
        disable_web_page_preview=True,
    )
    return NEW_USER_ASK_FOR_LAST_NAME


async def new_user_last_name(update: Update, context: ContextTypes.DEFAULT_TYPE):
    context.user_data['last_name'] = update.message.text
    await update.message.reply_text(_('i_need_help_wizard.questionnaire.new_user.ask_for_details'))
    return NEW_USER_ASK_FOR_DETAILS


async def new_user_details(update: Update, context: ContextTypes.DEFAULT_TYPE):
    details = update.message.text
    last_name = context.user_data['last_name']
    user = update.message.from_user

    channel_text = (
        f'Тип обращения: НОВЫЙ ЗАПРОС\n'
        f'Фамилия: {last_name}\n'
        f'Детали: {details}\n'
        f'User ID: {user.id}\n'
        f'Username: @{user.username}\n'
        f'Профиль: <a href="tg://user?id={user.id}">{user.username or user.id}</a>\n'
        f'#new_request'
    )
    await update.message.get_bot().send_message(
        os.environ['I_NEED_HELP_CHANNEL_ID'],
        channel_text,
        parse_mode='HTML',
    )
    await update.message.reply_text(_('i_need_help_wizard.final'), reply_markup=get_restart_markup())
    return RESTART


async def existing_user(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    await query.message.reply_text(_('i_need_help_wizard.questionnaire.existing_user.ask_last_name'))
    return EXISTING_USER


async def existing_user_switch(update: Update, context: ContextTypes.DEFAULT_TYPE):
    context.user_data['last_name'] = update.message.text
    keyboard = [
        [
            InlineKeyboardButton(_('i_need_help_wizard.questionnaire.switch.edit'), callback_data='edit'),
        ],
        [
            InlineKeyboardButton(_('i_need_help_wizard.questionnaire.switch.status'), callback_data='status'),
        ],
        [
            InlineKeyboardButton(_('i_need_help_wizard.questionnaire.switch.emergency'), callback_data='emergency'),
        ]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text(_('i_need_help_wizard.questionnaire.switch.question'), reply_markup=reply_markup)
    return ACTION_SWITCH


async def ticket_edit(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    await query.message.reply_text(_('i_need_help_wizard.questionnaire.edit.prompt'))
    return TICKET_EDIT


async def ticket_edit_result(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.message.from_user
    changes = update.message.text
    last_name = context.user_data['last_name']
    channel_text = (
        f'Тип обращения: ИЗМЕНЕНИЕ В ЗАЯВКЕ\n'
        f'Фамилия: {last_name}\n'
        f'Изменение информации: {changes or ""}\n'
        f'User ID: {user.id}\n'
        f'Username: @{user.username}\n'
        f'Профиль: <a href="tg://user?id={user.id}">{user.username or user.id}</a>\n'
        f'#ticket_edit'
    )
    await update.message.get_bot().send_message(
        os.environ['I_NEED_HELP_CHANNEL_ID'],
        channel_text,
        parse_mode='HTML',
    )

    await update.message.reply_text(_('i_need_help_wizard.final'), reply_markup=get_restart_markup())
    return RESTART


async def ticket_status(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    user = query.message.from_user
    last_name = context.user_data['last_name']

    channel_text = (
        f'Тип обращения: УЗНАТЬ СТАТУС ЗАЯВКИ\n'
        f'Фамилия: {last_name}\n'
        f'User ID: {user.id}\n'
        f'Username: @{user.username}\n'
        f'Профиль: <a href="tg://user?id={user.id}">{user.username or user.id}</a>\n'
        f'#status'
    )
    await query.message.get_bot().send_message(
        os.environ['I_NEED_HELP_CHANNEL_ID'],
        channel_text,
        parse_mode='HTML',
    )
    await query.message.reply_text(_('i_need_help_wizard.questionnaire.status.operator'),
                                   reply_markup=get_restart_markup())
    return RESTART


async def emergency(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    await query.message.reply_text(_('i_need_help_wizard.questionnaire.emergency.prompt'))
    return EMERGENCY


async def emergency_result(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.message.from_user
    emergency_text = update.message.text
    last_name = context.user_data['last_name']
    channel_text = (
        f'Тип обращения: СРОЧНАЯ ПОМОЩЬ\n'
        f'Фамилия: {last_name}\n'
        f'Ситуация: {emergency_text or ""}\n'
        f'User ID: {user.id}\n'
        f'Username: @{user.username}\n'
        f'Профиль: <a href="tg://user?id={user.id}">{user.username or user.id}</a>\n'
        f'#emergency'
    )
    await update.message.get_bot().send_message(
        os.environ['I_NEED_HELP_CHANNEL_ID'],
        channel_text,
        parse_mode='HTML',
    )

    await update.message.reply_text(_('i_need_help_wizard.final'), reply_markup=get_restart_markup())
    return RESTART


async def restart(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    if query:
        await query.answer()
        message = query.message
    else:
        message = update.message
    keyboard = [
        [
            InlineKeyboardButton(_('i_need_help_button'), callback_data='i_need_help_button'),
        ],
        [
            InlineKeyboardButton(_('i_want_to_help_button'), callback_data='i_want_to_help_button'),
        ]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await message.reply_text(_('what_you_want'), reply_markup=reply_markup)

    return WHAT_YOU_WANT


async def finish(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Cancels and ends the conversation."""
    user = update.message.from_user
    logger.info("User %s canceled the conversation.", user.first_name)
    await update.message.reply_text(
        "Bye! I hope we can talk again some day.", reply_markup=ReplyKeyboardRemove()
    )
    return ConversationHandler.END


def main() -> None:
    """Run the bot."""
    # Create the Application and pass it your bot's token.
    path = os.path.dirname(os.path.abspath(__file__))
    envpath = os.path.join(path, '.env')
    if os.path.exists(envpath):
        with open(envpath, 'rt') as conf:
            confdata = conf.readlines()
            for line in confdata:
                key, value = line.strip().split('=')
                os.environ[key] = value

    persistence = PicklePersistence(filepath=os.path.join(path, 'conversationbot'))
    application = Application.builder().token(os.environ['TOKEN']).persistence(persistence).build()

    # Add conversation handler with the states GENDER, PHOTO, LOCATION and BIO
    conv_handler = ConversationHandler(
        entry_points=[CommandHandler("start", start), MessageHandler(filters.TEXT, start)],
        states={
            WHAT_YOU_WANT: [
                CallbackQueryHandler(i_need_help, pattern='^i_need_help_button$'),
                CallbackQueryHandler(i_want_to_help, pattern='^i_want_to_help_button$'),
            ],
            I_WANT_TO_HELP: [
                CallbackQueryHandler(i_want_to_help__volunteer, pattern='^want_to_help__volunteer'),
                CallbackQueryHandler(i_want_to_help__feedback, pattern='^want_to_help__feedback$'),
            ],
            FEEDBACK_MODE: [
                MessageHandler(filters.TEXT, feedback_questionnaire),
            ],
            RESTART: [
                CallbackQueryHandler(restart),
                MessageHandler(filters.TEXT, restart)
            ],
            COUNTRY_SWITCH: [
                CallbackQueryHandler(country_russia, pattern='^country_russia$'),
                CallbackQueryHandler(country_ukraine, pattern='^country_ukraine$'),
                CallbackQueryHandler(country_estonia, pattern='^country_estonia$'),
                CallbackQueryHandler(country_latvia, pattern='^country_latvia$'),
                CallbackQueryHandler(country_other, pattern='^country_other$'),
            ],
            LEAVE_RUSSIA: [
                CallbackQueryHandler(country_estonia, pattern='^yes$'),
                CallbackQueryHandler(help_in_russia, pattern='^no$'),
            ],
            ESTONIA_SWITCH: [
                CallbackQueryHandler(ask_about_protection, pattern='^yes$'),
                CallbackQueryHandler(go_further, pattern='^no$'),
            ],
            PROTECTION_SWITCH: [
                CallbackQueryHandler(protection_yes, pattern='^yes$'),
                CallbackQueryHandler(protection_no, pattern='^no$'),
            ],
            HELP_IN_ESTONIA_SWITCH: [
                CallbackQueryHandler(everything_is_ok, pattern='^ok$'),
                CallbackQueryHandler(go_further, pattern='^help$'),
            ],
            QUESTIONNAIRE_SWITCH: [
                CallbackQueryHandler(new_user, pattern='^no$'),
                CallbackQueryHandler(existing_user, pattern='^yes$'),
            ],
            NEW_USER_ASK_FOR_LAST_NAME: [
                MessageHandler(filters.TEXT, new_user_last_name),
            ],
            NEW_USER_ASK_FOR_DETAILS: [
                MessageHandler(filters.TEXT, new_user_details),
            ],
            EXISTING_USER: [
                MessageHandler(filters.TEXT, existing_user_switch),
            ],
            ACTION_SWITCH: [
                CallbackQueryHandler(ticket_edit, pattern='^edit$'),
                CallbackQueryHandler(ticket_status, pattern='^status$'),
                CallbackQueryHandler(emergency, pattern='^emergency$'),
            ],
            TICKET_EDIT: [
                MessageHandler(filters.TEXT, ticket_edit_result),
            ],
            EMERGENCY: [
                MessageHandler(filters.TEXT, emergency_result),
            ]
        },
        fallbacks=[CommandHandler('finish', finish)],
    )

    application.add_handler(conv_handler)

    # Run the bot until the user presses Ctrl-C
    application.run_polling()


if __name__ == "__main__":
    main()
