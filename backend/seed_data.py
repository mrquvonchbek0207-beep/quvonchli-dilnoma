from sqlalchemy import select

from app.database import Base, SessionLocal, engine
from app.models import Category, Quote, Template


CATEGORIES = [
    {
        "slug": "birthdays",
        "name_uz": "Tabriklar",
        "name_ru": "Поздравления",
        "name_en": "Birthdays",
        "icon": "gift",
    },
    {
        "slug": "weddings",
        "name_uz": "Taklifnomalar",
        "name_ru": "Свадебные приглашения",
        "name_en": "Weddings",
        "icon": "mail",
    },
    {
        "slug": "love",
        "name_uz": "Dil izhori",
        "name_ru": "Признания в любви",
        "name_en": "Love",
        "icon": "heart",
    },
    {
        "slug": "family",
        "name_uz": "Oila",
        "name_ru": "Семья",
        "name_en": "Family",
        "icon": "heart",
    },
]

TEMPLATE_TITLES = {
    "birthdays": [
        ("Quvonchga to‘la kun", "День, полный радости", "A Day Full of Joy"),
        ("Yangi yoshingiz muborak", "С новым годом жизни", "A Bright New Year"),
        ("Orzular gullagan lahza", "Мгновение расцветающих мечтаний", "Where Dreams Bloom"),
        ("Shirin xotiralar", "Сладкие воспоминания", "Sweet Memories"),
        ("Siz uchun barcha ezguliklar", "Все самое доброе для вас", "All Good Things for You"),
        ("Bayramingiz porlasin", "Пусть праздник сияет", "Let Your Celebration Shine"),
        ("Mehr bilan bezatilgan kun", "День, согретый теплом", "A Day Wrapped in Love"),
        ("Kulgu va tilaklar", "Улыбки и пожелания", "Smiles and Wishes"),
        ("Eng go‘zal tilaklar", "Самые прекрасные пожелания", "Wishes as Lovely as You"),
        ("Quvonchli sahifa", "Новая радостная страница", "A Joyful New Chapter"),
    ],
    "weddings": [
        ("Baxt sari ilk qadam", "Первый шаг к счастью", "The First Step to Forever"),
        ("Ikki qalb, bir yo‘l", "Два сердца, один путь", "Two Hearts, One Journey"),
        ("Sevgi bilan yozilgan kun", "День, написанный любовью", "A Day Written in Love"),
        ("Oq libos va ezgu niyatlar", "Белое платье и добрые пожелания", "White Lace and Warm Wishes"),
        ("Bir umrga berilgan va’da", "Обещание на всю жизнь", "A Promise for a Lifetime"),
        ("Baxt bazmiga taklif", "Приглашение на праздник счастья", "An Invitation to Celebrate"),
        ("Qalbimizdagi eng go‘zal sana", "Самая прекрасная дата в наших сердцах", "Our Most Beautiful Day"),
        ("Yangi oila, yangi orzular", "Новая семья, новые мечты", "A New Family, New Dreams"),
        ("Quvonchimizga sherik bo‘ling", "Разделите с нами нашу радость", "Share in Our Happiness"),
        ("Muhabbat tantanasi", "Торжество любви", "A Celebration of Love"),
    ],
    "love": [
        ("Qalbimdagi eng yorqin satr", "Самая светлая строка в моём сердце", "The Brightest Line in My Heart"),
        ("Siz bor joy — mening uyim", "Мой дом там, где вы", "Where You Are Is Home"),
        ("Har kun siz bilan go‘zal", "С вами прекрасен каждый день", "Every Day Is Brighter with You"),
        ("Yurakdan yurakka", "От сердца к сердцу", "From One Heart to Another"),
        ("Ko‘nglim tanlagan inson", "Тот, кого выбрало моё сердце", "The One My Heart Chose"),
        ("Mehringizga bitilgan maktub", "Письмо, написанное вашей нежностью", "A Letter in Your Tenderness"),
        ("Nigohingizdagi olam", "Мир в вашем взгляде", "A World in Your Eyes"),
        ("Birga chizilgan orzular", "Мечты, созданные вместе", "Dreams We Draw Together"),
        ("Sokin baxtimiz", "Наше тихое счастье", "Our Quiet Happiness"),
        ("Sizga atalgan so‘zlar", "Слова, посвящённые вам", "Words Meant for You"),
    ],
    "family": [
        ("Mehr maskani", "Дом, наполненный теплом", "A Home Filled with Love"),
        ("Oila — eng katta boylik", "Семья — наше главное богатство", "Family Is Our Greatest Treasure"),
        ("Bir dasturxon atrofida", "За одним семейным столом", "Together Around the Table"),
        ("Avlodlar rishtasi", "Связь поколений", "The Bond Between Generations"),
        ("Uyimizdagi quvonch", "Радость нашего дома", "The Joy in Our Home"),
        ("Mehr bilan ulg‘aygan qalblar", "Сердца, выросшие в любви", "Hearts Raised with Love"),
        ("Yaqinlar davrasida", "В кругу самых близких", "Among Those We Love"),
        ("Bir-birimizga suyanch", "Опора друг для друга", "There for One Another"),
        ("Qadrli oilamga", "Моей дорогой семье", "For My Dear Family"),
        ("Xonadonimizga fayz", "Счастье и уют нашему дому", "Warmth and Joy at Home"),
    ],
}

QUOTE_TEXT = {
    "birthdays": [
        (
            "mother",
            "warm",
            "Ona, mehringiz hayotimning eng yorug‘ chirog‘i. Yangi yoshingiz sog‘lik, xotirjamlik va qalbingizga yarashgan quvonch olib kelsin.",
            "Мама, ваша любовь — самый яркий свет в моей жизни. Пусть новый год жизни принесёт вам здоровье, спокойствие и радость, которой достойно ваше сердце.",
            "Mom, your love is the brightest light in my life. May this new year bring you health, peace, and all the joy your heart deserves.",
        ),
        (
            "friend",
            "cheerful",
            "Do‘stim, kulgingiz davramizga bahor olib kiradi. Yangi yoshingiz kutilmagan quvonchlar va ushalgan orzularga boy bo‘lsin.",
            "Друг, ваша улыбка приносит весну в нашу компанию. Пусть новый год жизни будет полон неожиданных радостей и сбывшихся мечтаний.",
            "Friend, your laughter brings spring into every room. May your new year be filled with lovely surprises and dreams coming true.",
        ),
        (
            "spouse",
            "romantic",
            "Yoningizda har bir fasl go‘zal, har bir kun bayram. Tug‘ilgan kuningizda qalbingizga bergan mehringizdek cheksiz baxt tilayman.",
            "Рядом с вами прекрасен каждый сезон и праздничен каждый день. В ваш день рождения желаю вам бесконечного счастья — такого же тёплого, как ваша любовь.",
            "With you, every season is beautiful and every day feels like a celebration. On your birthday, I wish you happiness as boundless as the love you give.",
        ),
        (
            "family",
            "grateful",
            "Azizim, oilamizning quvonchi siz bilan yanada to‘liq. Yangi yoshingiz mehr, baraka va birga yaratadigan shirin xotiralarga to‘lsin.",
            "Дорогой наш человек, с вами радость семьи становится полнее. Пусть новый год жизни принесёт любовь, благополучие и много тёплых общих воспоминаний.",
            "Dear one, our family is happier with you in it. May the year ahead bring love, abundance, and many beautiful memories made together.",
        ),
        (
            "friend",
            "hopeful",
            "Bugun tilaklar osmonida sizning yulduzingiz charaqlasin. Har bir yangi kun ko‘nglingizga yaqin bir mo‘jizani olib kelsin.",
            "Пусть сегодня ваша звезда ярко сияет среди всех пожеланий. Пусть каждый новый день приносит маленькое чудо, близкое вашему сердцу.",
            "May your star shine brightest among all today's wishes. May every new day bring a small wonder close to your heart.",
        ),
    ],
    "weddings": [
        (
            "friend",
            "celebratory",
            "Bugun ikki qalbning quvonchi barchamizga nur sochadi. Yangi yo‘lingiz mehr, kulgu va do‘stlar davrasidagi go‘zal xotiralarga to‘lsin.",
            "Сегодня радость двух сердец освещает всех вокруг. Пусть ваш общий путь будет наполнен любовью, смехом и прекрасными встречами с друзьями.",
            "Today, the joy of two hearts brightens everyone around them. May your shared path be full of love, laughter, and wonderful moments with friends.",
        ),
        (
            "family",
            "warm",
            "Yangi xonadoningizda mehr hech qachon kamaymasin, dasturxoningizdan fayz arimasin. Bir-biringizga har kuni eng yaqin inson bo‘lib qoling.",
            "Пусть в вашем новом доме никогда не станет меньше любви и уюта. Оставайтесь друг для друга самыми близкими людьми каждый день.",
            "May your new home never run short of love or warmth. Keep choosing one another as your closest person, every single day.",
        ),
        (
            "mother",
            "tender",
            "Bugun farzandimning baxti ko‘zlarimga quvonch yoshini keltiradi. Qurgan oilangizga tinchlik, sabr va bir umrga yetadigan muhabbat tilayman.",
            "Сегодня счастье моего ребёнка наполняет глаза радостными слезами. Желаю вашей семье мира, терпения и любви на всю жизнь.",
            "Today, my child's happiness brings tears of joy to my eyes. I wish your new family peace, patience, and a love that lasts a lifetime.",
        ),
        (
            "spouse",
            "romantic",
            "Qo‘limni tutganingiz — hayotimdagi eng go‘zal va’da. Bugun ham, ertaga ham, barcha yo‘llarda sizni sevib tanlayman.",
            "Ваша рука в моей — самое прекрасное обещание в моей жизни. Сегодня, завтра и на каждом пути я снова выбираю вас.",
            "Your hand in mine is the loveliest promise of my life. Today, tomorrow, and along every road, I will keep choosing you.",
        ),
        (
            "guest",
            "welcoming",
            "Quvonchimizni baham ko‘rganingiz uchun rahmat. Siz bilan aytilgan har bir tabrik va ko‘tarilgan har bir qadah bu kunni yanada unutilmas qiladi.",
            "Спасибо, что разделили с нами эту радость. Каждое ваше поздравление и каждый тост делают этот день ещё более незабываемым.",
            "Thank you for sharing our joy. Every kind wish and every toast with you makes this day even more unforgettable.",
        ),
    ],
    "love": [
        (
            "spouse",
            "romantic",
            "Siz bilan sukut ham ma’noli, oddiy kun ham bayram. Qalbim sizni har tong qaytadan tanlaydi.",
            "С вами даже молчание наполнено смыслом, а обычный день становится праздником. Моё сердце выбирает вас каждое утро заново.",
            "With you, even silence has meaning and an ordinary day becomes a celebration. My heart chooses you anew each morning.",
        ),
        (
            "spouse",
            "devoted",
            "Mehringiz qalbimga qo‘nim topgan eng sokin qo‘shiq. Hayot yo‘limning har bir sahifasida yonimda bo‘lishingizni istayman.",
            "Ваша нежность — самая тихая песня, поселившаяся в моём сердце. Я хочу, чтобы вы были рядом на каждой странице моей жизни.",
            "Your tenderness is the gentlest song that has found a home in my heart. I want you beside me on every page of my life.",
        ),
        (
            "friend",
            "affectionate",
            "Siz bilan suhbatlarim ko‘nglimdagi bulutlarni tarqatadi. Hayotimda borligingiz — har kuni qadrlaydigan go‘zal sovg‘a.",
            "Наши разговоры разгоняют облака в моей душе. Ваше присутствие в моей жизни — прекрасный подарок, которому я радуюсь каждый день.",
            "Our conversations chase the clouds from my heart. Having you in my life is a beautiful gift I appreciate every day.",
        ),
        (
            "family",
            "grateful",
            "Sizning mehringiz qayerda bo‘lsam ham uyga qaytgandek his qildiradi. Qalbimdagi eng iliq joy doim siz uchun.",
            "Ваша любовь даёт мне ощущение дома, где бы я ни был. Самое тёплое место в моём сердце всегда принадлежит вам.",
            "Your love makes me feel at home wherever I am. The warmest place in my heart will always be yours.",
        ),
        (
            "mother",
            "tender",
            "Ona, mehringiz dunyodagi ilk va eng go‘zal tilim bo‘ldi. Sizni har bir ezgu so‘zim va har bir duoyim bilan yaxshi ko‘raman.",
            "Мама, ваша любовь стала первым и самым прекрасным языком, который я узнал. Я люблю вас в каждом добром слове и каждой молитве.",
            "Mom, your love was the first and most beautiful language I ever learned. I love you in every kind word and every quiet prayer.",
        ),
    ],
    "family": [
        (
            "mother",
            "grateful",
            "Ona, qo‘llaringizdagi mehr butun uyimizga fayz beradi. Siz bor joyda ko‘nglimiz xotirjam, dasturxonimiz barakali.",
            "Мама, тепло ваших рук наполняет уютом весь наш дом. Там, где вы, нашим сердцам спокойно, а семейному столу сопутствует достаток.",
            "Mom, the care in your hands brings warmth to our whole home. Where you are, our hearts are at peace and our table feels abundant.",
        ),
        (
            "father",
            "respectful",
            "Dada, sokin maslahatlaringiz bizga yo‘l, sabringiz esa kuch beradi. Sizdan o‘rgangan mehr va matonat oilamizga tayanch bo‘lib turadi.",
            "Папа, ваши мудрые советы указывают нам путь, а ваше терпение придаёт силы. Любовь и стойкость, которым вы нас научили, поддерживают всю семью.",
            "Dad, your steady counsel shows us the way, and your patience gives us strength. The care and courage you taught us hold our family together.",
        ),
        (
            "spouse",
            "devoted",
            "Birga qurgan uyimiz devorlardan emas, ishonch va mehrdan bunyod bo‘lgan. Har kun shu oilani siz bilan asrashni tanlayman.",
            "Наш дом построен не из стен, а из доверия и любви. Каждый день я снова выбираю беречь эту семью вместе с вами.",
            "The home we built is made not of walls, but of trust and kindness. Every day, I choose to care for this family with you.",
        ),
        (
            "family",
            "togetherness",
            "Birga kulgan xonadonning chirog‘i hech qachon so‘nmaydi. Mehrimiz ko‘payib, har birimiz boshqamiz uchun suyanch bo‘laylik.",
            "Свет в доме, где смеются вместе, никогда не гаснет. Пусть нашей любви становится больше, а мы всегда будем опорой друг для друга.",
            "The light in a home that laughs together never fades. May our love keep growing, and may we always be there for one another.",
        ),
        (
            "friend",
            "welcoming",
            "Oilamiz davrasida sizga hamisha joy bor. Do‘stingizni yaqinlarimiz qatorida ko‘rish — biz uchun alohida quvonch.",
            "В кругу нашей семьи для вас всегда найдётся место. Видеть друга среди близких — особая радость для нас.",
            "There will always be a place for you in our family circle. Having a friend among our loved ones is a special joy.",
        ),
    ],
}


def _validate_seed_content() -> None:
    category_slugs = {category["slug"] for category in CATEGORIES}
    if len(CATEGORIES) != 4 or len(category_slugs) != 4:
        raise ValueError("The seed must define exactly four unique categories.")

    if set(TEMPLATE_TITLES) != category_slugs:
        raise ValueError("Template titles must be defined for every seed category.")
    if any(len(TEMPLATE_TITLES[slug]) != 10 for slug in category_slugs):
        raise ValueError("Each category must define exactly ten templates.")

    if set(QUOTE_TEXT) != category_slugs:
        raise ValueError("Quotes must be defined for every seed category.")
    if any(len(QUOTE_TEXT[slug]) < 3 or len(QUOTE_TEXT[slug]) > 5 for slug in category_slugs):
        raise ValueError("Each category must define between three and five quotes.")


def seed_data() -> dict[str, int]:
    _validate_seed_content()
    Base.metadata.create_all(bind=engine)

    added_categories = 0
    added_templates = 0
    added_quotes = 0
    with SessionLocal.begin() as session:
        categories_by_slug = {
            category.slug: category
            for category in session.scalars(select(Category)).all()
        }
        for values in CATEGORIES:
            if values["slug"] not in categories_by_slug:
                category = Category(**values)
                session.add(category)
                categories_by_slug[category.slug] = category
                added_categories += 1
        session.flush()

        category_ids = {
            category.slug: category.id
            for category in categories_by_slug.values()
        }
        existing_templates = {
            (template.category_id, template.name_uz, template.name_ru, template.name_en)
            for template in session.scalars(select(Template)).all()
        }
        existing_quotes = {
            (
                quote.category_id,
                quote.relation,
                quote.mood,
                quote.text_uz,
                quote.text_ru,
                quote.text_en,
            )
            for quote in session.scalars(select(Quote)).all()
        }

        templates = []
        palettes = ("rose", "amber", "violet", "emerald", "blue")
        for category_slug, title_rows in TEMPLATE_TITLES.items():
            category_id = category_ids[category_slug]
            for index, (name_uz, name_ru, name_en) in enumerate(title_rows, start=1):
                template_key = (category_id, name_uz, name_ru, name_en)
                if template_key in existing_templates:
                    continue
                image_seed = f"joyful-dilnoma-{category_slug}-{index:02d}"
                templates.append(
                    Template(
                        category_id=category_id,
                        name_uz=name_uz,
                        name_ru=name_ru,
                        name_en=name_en,
                        style_config={
                            "accent": palettes[(index - 1) % len(palettes)],
                            "layout": "classic" if index % 2 else "modern",
                        },
                        preview_img=(
                            f"https://picsum.photos/seed/{image_seed}/1200/900"
                        ),
                    )
                )
        session.add_all(templates)
        added_templates = len(templates)

        quotes = []
        for category_slug, quote_rows in QUOTE_TEXT.items():
            category_id = category_ids[category_slug]
            for relation, mood, text_uz, text_ru, text_en in quote_rows:
                quote_key = (
                    category_id,
                    relation,
                    mood,
                    text_uz,
                    text_ru,
                    text_en,
                )
                if quote_key in existing_quotes:
                    continue
                quotes.append(
                    Quote(
                        category_id=category_id,
                        relation=relation,
                        mood=mood,
                        text_uz=text_uz,
                        text_ru=text_ru,
                        text_en=text_en,
                    )
                )
        session.add_all(quotes)
        added_quotes = len(quotes)

    print(
        f"Added {added_categories} categories, {added_templates} templates, "
        f"and {added_quotes} multilingual quotes."
    )
    return {
        "categories": added_categories,
        "templates": added_templates,
        "quotes": added_quotes,
    }


if __name__ == "__main__":
    seed_data()
