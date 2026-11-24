import { bi, type UseCaseItem } from "./types";

export const USE_CASES: UseCaseItem[] = [
  {
    id: "lesson-plan",
    label: bi("1. Fiche de séance", "1. جذاذة حصة"),
    grade: "4AEP",
    subject: bi("Français · Lecture / Langue", "الفرنسية · القراءة واللغة"),
    objective: bi(
      "Identifier et utiliser les indicateurs de temps dans un court récit.",
      "تعرّف واستعمال روابط الزمن داخل نص سردي قصير."
    ),
    competency: bi(
      "Produire et comprendre un récit simple structuré chronologiquement.",
      "فهم وإنتاج نص سردي بسيط منظم زمنياً."
    ),
    promptFr: `Rôle : Conseiller pédagogique du primaire au Maroc.
Niveau : 4AEP (élèves âgés de 9-10 ans).
Discipline : Français.
Objectif d'apprentissage fourni par l'enseignant : Identifier les indicateurs de temps (d'abord, ensuite, enfin) dans un texte court de 6 lignes.
Contraintes : Vocabulaire accessible, classe à effectif de 34 élèves avec un seul vidéoprojecteur et des cahiers. Aucune donnée personnelle.
Format : Fiche de séance en 35 minutes (Mise en situation, Découverte, Application en binômes, Trace écrite au tableau).`,
    promptAr: `الدور: مستشار تربوي في التعليم الابتدائي بالمغرب.
المستوى: الرابع ابتدائي (4AEP).
المادة: اللغة الفرنسية.
الهدف التعلمي المحدد من الأستاذ(ة): تعرّف واستعمال روابط الزمن (d'abord, ensuite, enfin) في نص قصير من 6 أسطر.
الشروط: معجم بسيط، قسم من 34 تلميذاً بمسلاط عاكس واحد ودفاتر، بدون أي معطيات شخصية.
الشكل: جذاذة حصة من 35 دقيقة (وضعية الانطلاق، الاكتشاف، التطبيق الثنائي، الملخص على السبورة).`,
    draftOutputTitle: bi("Trame de séance 4AEP (35 min)", "خطاطة حصة الرابع ابتدائي (35 د)"),
    draftOutputFr: `1. Mise en situation (5 min) : Écrire au tableau 3 phrases mélangées sur le trajet vers l'école. Demander oralement comment remettre l'histoire dans l'ordre.
2. Découverte (10 min) : Projeter ou lire le mini-texte « Le matin de Salma » et surligner D'abord, Ensuite, Enfin.
3. Application guidée (12 min) : En binômes sur ardoise/cahier, compléter 3 phrases avec le bon connecteur.
4. Trace écrite courte (8 min) : Règle de 2 lignes copiée par les élèves + 1 phrase personnelle.`,
    draftOutputAr: `1. وضعية الانطلاق (5 د): كتابة 3 جمل مبعثرة على السبورة حول الطريق إلى المدرسة ومناقشة ترتيبها شفهياً.
2. الاكتشاف (10 د): عرض أو قراءة النص القصير وتمييز الروابط الزمنية (D'abord, Ensuite, Enfin).
3. التطبيق الموجه (12 د): عمل ثنائي على الألواح والدفاتر لإكمال 3 جمل بالرابط المناسب.
4. أثر مكتوب (8 د): كتابة قاعدة قصيرة من سطرين مع جملة شخصية من إنتاج المتعلم.`,
    teacherCheck: bi(
      "Vérifier que les mots choisis figurent déjà dans le lexique travaillé en classe durant l'unité en cours.",
      "التحقق من أن الكلمات المختارة تندرج ضمن المعجم المدروس في الوحدة الجارية."
    ),
  },
  {
    id: "three-levels",
    label: bi("2. 3 niveaux (TaRL)", "2. ثلاثة مستويات (TaRL)"),
    grade: "3AEP",
    subject: bi("Mathématiques · Calcul", "الرياضيات · الحساب"),
    objective: bi(
      "Effectuer des additions avec et sans retenue selon le niveau réel de l'élève.",
      "إنجاز عمليات الجمع باحتفاظ وبدون احتفاظ حسب المستوى الفعلي للمتعلم."
    ),
    competency: bi(
      "Calculer des sommes jusqu'à 999 avec compréhension de la retenue.",
      "حساب مجاميع إلى حدود 999 مع فهم معنى الاحتفاظ."
    ),
    promptFr: `Rôle : Enseignant du primaire pratiquant la pédagogie différenciée (principe TaRL : partir du niveau réel de l'élève).
Niveau : 3AEP.
Objectif : Additionner deux nombres à 2 ou 3 chiffres.
Tâche : Génère exactement 3 parcours d'exercices progressifs sur le même objectif :
- Parcours Base (consolidation sans retenue, nombres < 100)
- Parcours Intermédiaire (une retenue sur les unités)
- Parcours Défi (deux retenues + 1 petit problème contextualisé à Mediouna : marché, cahiers de classe).
Format : Clair, copiable sur fiche ou tableau, avec corrigé séparé.`,
    promptAr: `الدور: أستاذ(ة) بالتعليم الابتدائي يعتمد البيداغوجيا الفارقية (منطق TaRL: الانطلاق من المستوى الفعلي للتلميذ).
المستوى: الثالث ابتدائي (3AEP).
الهدف: جمع عددين من رقمين أو ثلاثة أرقام.
المطلوب: إنتاج 3 مسارات متدرجة لنفس الهدف:
- المسار الأساسي (بدون احتفاظ، أعداد أصغر من 100)
- المسار المتوسط (احتفاظ واحد في الوحدات)
- مسار التحدي (احتفاظان + مسألة قصيرة من محيط مديونة)
الشكل: واضح وقابل للنسخ على السبورة أو الطباعة مع تصحيح منفصل.`,
    draftOutputTitle: bi("Exercices gradués en 3 parcours", "تمارين متدرجة في 3 مسارات"),
    draftOutputFr: `• Parcours Base : 24 + 13 = ___ | 41 + 27 = ___ | 52 + 36 = ___
• Parcours Intermédiaire : 38 + 25 = ___ | 147 + 36 = ___ | 264 + 118 = ___
• Parcours Défi : 378 + 245 = ___ | Problème : La coopérative scolaire achète 185 cahiers bleus et 148 cahiers rouges. Combien de cahiers y a-t-il en tout ?`,
    draftOutputAr: `• المسار الأساسي: 24 + 13 = ___ | 41 + 27 = ___ | 52 + 36 = ___
• المسار المتوسط: 38 + 25 = ___ | 147 + 36 = ___ | 264 + 118 = ___
• مسار التحدي: 378 + 245 = ___ | مسألة: اشترت التعاونية المدرسية 185 دفتراً أزرق و148 دفتراً أحمر. ما مجموع الدفاتر؟`,
    teacherCheck: bi(
      "Adapter les nombres selon l'évaluation diagnostique rapide de vos élèves en début de semaine.",
      "تكييف الأعداد حسب نتائج التقويم التشخيصي السريع لتلاميذكم في بداية الأسبوع."
    ),
    printable: true,
  },
  {
    id: "arabic-reading",
    label: bi("3. Lecture arabe (RTL)", "3. القراءة العربية (RTL)"),
    grade: "2AEP",
    subject: bi("Langue Arabe · Lecture", "اللغة العربية · القراءة"),
    objective: bi(
      "Lire et distinguer les mots contenant les voyelles courtes et longues (مد بالألف والواو).",
      "تمييز وقراءة الكلمات التي تتضمن الحركات القصيرة والطويلة (المد بالألف والواو)."
    ),
    competency: bi(
      "Décoder et comprendre de courtes phrases familières en arabe.",
      "فك الرموز القرائية وفهم جمل قصيرة مألوفة."
    ),
    promptFr: `Rôle : Enseignant(e) du primaire au Maroc.
Niveau : 2AEP.
Objectif : Lire et comprendre un court texte vocalisé de 4 phrases distinguant la fatha (فتحة) et le madd bil-alif (المد بالألف).
Contraintes : Texte arabe entièrement vocalisé (شكل تام), contexte scolaire proche de l'élève, suivi de 3 questions simples exploitables au tableau ou imprimables.`,
    promptAr: `الدور: أستاذ(ة) التعليم الابتدائي بالمغرب.
المستوى: الثاني ابتدائي (2AEP).
الهدف التعلمي: قراءة وفهم نص قصير من 4 جمل يركز على التمييز بين الفتحة والمد بالألف.
الشروط: لغة واضحة، مشكولة شكلاً تاماً، مناسبة لبيئة التلميذ، مع 3 أسئلة فهم بسيطة قابلة للكتابة على السبورة أو الطباعة.`,
    draftOutputTitle: bi("Texte vocalisé + 3 questions (2AEP)", "نص قرائي مشكول + أسئلة فهم (2AEP)"),
    draftOutputFr: `Texte (voir bloc arabe ci-contre) : Sami et Salma vont à l'école le matin avec un cahier neuf et un stylo bleu, puis lisent de beaux mots au tableau dans la cour.
Questions : 1) Où vont Sami et Salma ? 2) Qu'a pris Sami dans son cartable ? 3) Relève deux mots avec « مد بالألف ».`,
    draftOutputAr: `النَّصُّ:
فِي الصَّبَاحِ، ذَهَبَ سَامِي مَعَ أُخْتِهِ سَلْمَى إِلَى الْمَدْرَسَةِ.
حَمَلَ سَامِي كِتَابًا جَدِيدًا وَقَلَمًا أَزْرَقَ.
فِي السَّاحَةِ، قَرَأَ الأَطْفَالُ كَلِمَاتٍ جَمِيلَةً عَلَى السَّبُّورَةِ.

أَسْئِلَةُ الْفَهْمِ:
1. إِلَى أَيْنَ ذَهَبَ سَامِي وَسَلْمَى؟
2. مَاذَا حَمَلَ سَامِي فِي مِحْفَظَتِهِ؟
3. استخرج من النص كلمتين بهما مد بالألف (مثل: الصَّبَاحِ، كِتَابًا).`,
    teacherCheck: bi(
      "Vérifier l'exactitude complète de la vocalisation (تشكيل) avant projection ou impression.",
      "التأكد من ضبط الشكل التام للحروف قبل عرضه على السبورة أو طباعته للتلاميذ."
    ),
    printable: true,
  },
  {
    id: "vocab-bilingual",
    label: bi("4. Vocabulaire AR/FR", "4. معجم ثنائي اللغة"),
    grade: "3AEP–4AEP",
    subject: bi("Français / Arabe · Lexique", "الفرنسية / العربية · المعجم"),
    objective: bi(
      "Associer le vocabulaire de la classe et de l'environnement proche en français et en arabe.",
      "ربط معجم القسم والمحيط القريب باللغتين الفرنسية والعربية."
    ),
    competency: bi(
      "Enrichir le lexique oral et écrit par correspondance bilingue.",
      "إغناء الرصيد اللغوي الشفهي والكتابي عبر التقابل الثنائي."
    ),
    promptFr: `Rôle : Enseignant du primaire bilingue.
Niveau : 3AEP / 4AEP.
Thème : Les fournitures et l'espace de la classe.
Tâche : Crée 4 à 6 paires de mots français / arabe vocalisé (تشكيل) avec une phrase courte en français pour chaque mot et une question de réemploi.`,
    promptAr: `الدور: أستاذ(ة) للتعليم الابتدائي ثنائي اللغة.
المستوى: الثالث والرابع ابتدائي (3AEP–4AEP).
المجال: أدوات وفضاء القسم.
المطلوب: إعداد 4 إلى 6 أزواج من الكلمات (فرنسية / عربية مشكولة) مع جملة قصيرة بالفرنسية ونشاط توظيف سريع.`,
    draftOutputTitle: bi("Mini-lexique bilingue pour flashcards", "معجم مصغر ثنائي للبطاقات"),
    draftOutputFr: `1. Le tableau — السَّبُّورَةُ → « L'enseignant écrit la date au tableau. »
2. Le cahier — الدَّفْتَرُ → « J'ouvre mon cahier proprement. »
3. La règle — الْمِسْطَرَةُ → « Je trace un trait droit avec la règle. »
4. La bibliothèque — الْمَكْتَبَةُ → « Nous empruntons un album à la bibliothèque. »`,
    draftOutputAr: `1. السَّبُّورَةُ — Le tableau
2. الدَّفْتَرُ — Le cahier
3. الْمِسْطَرَةُ — La règle
4. الْمَكْتَبَةُ — La bibliothèque
تطبيق سريع في القسم: يرفع التلميذ البطاقة العربية عندما يسمع الكلمة الفرنسية، ثم يقرأ الجملة بصوت مسموع.`,
    teacherCheck: bi(
      "Vérifier l'exactitude des voyelles arabes et la prononciation orale en début de séance.",
      "التحقق من صحة الشكل والنطق الشفهي في بداية الحصة."
    ),
  },
  {
    id: "math-decomposition",
    label: bi("5. Décomposition maths", "5. تفكيك الأعداد"),
    grade: "3AEP",
    subject: bi("Mathématiques · Numération", "الرياضيات · التعداد"),
    objective: bi(
      "Décomposer un nombre à 3 chiffres sous forme additive et par rang (C / D / U).",
      "تفكيك عدد من 3 أرقام كتابة جمعية وحسب المراتب (مئات / عشرات / وحدات)."
    ),
    competency: bi(
      "Maîtriser la valeur positionnelle des chiffres dans un nombre entier.",
      "إتقان القيمة المكانية للأرقام داخل عدد صحيح."
    ),
    promptFr: `Rôle : Enseignant de mathématiques au primaire marocain.
Niveau : 3AEP.
Objectif : Décomposer les nombres de 100 à 999 en centaines, dizaines et unités.
Tâche : Propose une progression visuelle en exemples (tableau C | D | U) puis 3 exercices gradués incluant le cas du zéro intercalaire.`,
    promptAr: `الدور: أستاذ(ة) الرياضيات بالتعليم الابتدائي المغربي.
المستوى: الثالث ابتدائي (3AEP).
الهدف: تفكيك الأعداد من 100 إلى 999 إلى مئات وعشرات ووحدات.
المطلوب: تدرج بصري بجدول (م | ع | و) متبوع بـ 3 تمارين متدرجة تشمل حالة الصفر الوسيط.`,
    draftOutputTitle: bi("Atelier décomposition C / D / U", "ورشة تفكيك م / ع / و"),
    draftOutputFr: `Exemple modèle : 347 = 3 centaines + 4 dizaines + 7 unités = 300 + 40 + 7
Exercices guidés :
1) 254 = ___ + ___ + ___
2) 508 = ___ centaines + ___ dizaines + ___ unités (piège du zéro !)
3) Retrouve le nombre : 400 + 60 + 9 = ___`,
    draftOutputAr: `مثال نموذجي: 347 = 3 مئات + 4 عشرات + 7 وحدات = 300 + 40 + 7
تمارين موجهة:
1) 254 = ___ + ___ + ___
2) 508 = ___ مئات + ___ عشرات + ___ وحدات (انتبه للصفر!)
3) اكتب العدد: 400 + 60 + 9 = ___`,
    teacherCheck: bi(
      "Insister sur le rôle du zéro intercalaire (ex. 508) qui génère souvent des erreurs chez les élèves.",
      "التأكيد على دور الصفر الوسيط (مثل 508) الذي يوقع بعض التلاميذ في الخطأ."
    ),
    printable: true,
  },
  {
    id: "remediation",
    label: bi("6. Remédiation", "6. الدعم التربوي"),
    grade: "2AEP–5AEP",
    subject: bi("Soutien scolaire / Fondamentaux", "الدعم المدرسي / التعلمات الأساس"),
    objective: bi(
      "Corriger la confusion fréquente entre b/d ou p/q en lecture française (ou ب/ت/ث en arabe).",
      "معالجة الخلط المتكرر بين الحروف المتشابهة (b/d بالفرنسية أو ب/ت/ث بالعربية)."
    ),
    competency: bi(
      "Automatiser la discrimination visuelle et phonologique.",
      "ترسيخ التمييز البصري والصوتي للمقاطع."
    ),
    promptFr: `Rôle : Enseignant animateur d'atelier de remédiation (soutien ciblé).
Public : Petit groupe de 6 élèves de 3AEP ayant encore des confusions entre b et d.
Contraintes : Séance courte de 15 minutes sans matériel informatique individuel (ardoises + tableau).
Format : 1) Repère visuel mnémotechnique simple, 2) 8 syllabes contrastées à lire, 3) 4 mots à entourer sur ardoise.`,
    promptAr: `الدور: أستاذ(ة) منشط(ة) لحصة الدعم التربوي المركز.
الفئة: مجموعة صغيرة من 6 تلاميذ (3AEP) يخلطون بين حرفي b و d.
الشروط: حصة قصيرة (15 دقيقة) باستعمال الألواح والسبورة فقط.
الشكل: 1) معين بصري بسيط للتذكر، 2) 8 مقاطع متقابلة للقراءة، 3) 4 كلمات للتمييز على الألواح.`,
    draftOutputTitle: bi("Micro-séance remédiation b / d (15 min)", "حصة دعم مصغرة للتمييز (15 د)"),
    draftOutputFr: `• Astuce visuelle : « b » regarde vers la droite comme le ventre de « ballon » ; « d » a le dos tourné comme « dos ».
• Syllabes flash au tableau : ba – da / bi – di / bou – dou / bra – dra.
• Jeu d'ardoise : Dictée flash de 4 syllabes, levée collective d'ardoises, correction immédiate bienveillante.`,
    draftOutputAr: `• حيلة بصرية: الحرف «b» يتجه لليمين والحرف «d» يتجه لليسار.
• مقاطع سريعة على السبورة: ba – da / bi – di / bou – dou / bra – dra.
• لعبة الألواح: إملاء سريع لـ 4 مقاطع، رفع جماعي للألواح، وتصحيح فوري مشجع.`,
    teacherCheck: bi(
      "Observer quels élèves hésitent encore après 10 minutes pour ajuster le groupe de la séance suivante.",
      "ملاحظة المتعلمين الذين ما زالوا مترددين بعد 10 دقائق لتعديل مجموعة الحصة الموالية."
    ),
  },
  {
    id: "formative-print",
    label: bi("7. Éval & fiche A4", "7. تقويم وورقة A4"),
    grade: "5AEP",
    subject: bi("Mathématiques · Fractions", "الرياضيات · الكسور"),
    objective: bi(
      "Vérifier la compréhension des fractions simples avant d'aborder l'addition de fractions.",
      "التحقق من فهم الكسور البسيطة قبل الانتقال إلى جمع الكسور."
    ),
    competency: bi(
      "Représenter, lire et comparer des fractions simples (1/2, 1/4, 3/4).",
      "تمثيل وقراءة ومقارنة الكسور البسيطة (1/2، 1/4، 3/4)."
    ),
    promptFr: `Rôle : Enseignant de 5AEP.
Objectif : Évaluation formative rapide (5 questions en 8 minutes) sur les fractions simples.
Tâche : Crée 4 QCM conçus pour révéler les erreurs typiques (confondre numérateur et dénominateur, oublier l'égalité des parts) + 1 question de dessin à partager sur papier A4.`,
    promptAr: `الدور: أستاذ(ة) الخامس ابتدائي (5AEP).
الهدف: تقويم تكويني سريع (5 أسئلة في 8 دقائق) حول الكسور البسيطة.
المطلوب: إعداد أسئلة اختيار من متعدد تكشف الأخطاء الشائعة (الخلط بين البسط والمقام، نسيان تساوي الأجزاء) مع سؤال تمثيل على ورقة A4.`,
    draftOutputTitle: bi("Mini-diagnostic Fractions (5 questions)", "رائز تشخيصي للكسور (5 أسئلة)"),
    draftOutputFr: `Q1. Une barre de chocolat a 4 parts égales. Sara mange 1 part. Quelle fraction reste-t-il ? (A: 1/4 · B: 3/4 · C: 4/3)
Q2. Si un gâteau est coupé en 3 parts INÉGALES, une part représente-t-elle exactement 1/3 ? (Oui / Non et pourquoi ?)
→ Diagnostic rapide : Si l'élève répond 1/4 à Q1, travailler la lecture attentive de la consigne ; si Oui à Q2, renforcer la notion de partage équitable.`,
    draftOutputAr: `س1: لوح شوكولاتة مقسم إلى 4 أجزاء متساوية. أكلت سارة جزءاً واحداً. ما الكسر الذي يمثل الباقي؟ (1/4 · 3/4 · 4/3)
س2: إذا قُسّمت حلوى إلى 3 أجزاء غير متساوية، هل يمثل الجزء الواحد 1/3؟ (نعم / لا ولماذا؟)
← التشخيص: الخلط يكشف الحاجة لترسيخ قراءة المطلوب وفكرة التقسيم المتساوي.`,
    teacherCheck: bi(
      "Imprimer 2 fiches par page A4 pour économiser le papier ou projeter les 4 QCM au tableau.",
      "طباعة بطاقتين في كل صفحة A4 للاقتصاد في الورق أو عرض الأسئلة على السبورة."
    ),
    printable: true,
  },
  {
    id: "admin-projection",
    label: bi("8. Admin & classe", "8. التدبير والتواصل"),
    grade: "1AEP–6AEP",
    subject: bi("Organisation & Communication", "التنظيم والتواصل الأسري"),
    objective: bi(
      "Rédiger un mot clair pour les familles sur l'organisation du soutien scolaire sans jargon.",
      "صياغة إشعار واضح للأسر حول مواكبة القراءة والدعم بدون مصطلحات معقدة."
    ),
    competency: bi(
      "Communiquer efficacement avec les parents en arabe et en français.",
      "التواصل الفعال مع أمهات وآباء التلاميذ بالعربية والفرنسية."
    ),
    promptFr: `Rôle : Enseignant d'école primaire publique à Mediouna.
Tâche : Rédige un court mot d'information bilingue (français simple + arabe) à coller dans le cahier de liaison pour inviter les parents à encourager 10 minutes de lecture à la maison chaque soir. Ton chaleureux et respectueux, sans termes techniques.`,
    promptAr: `الدور: أستاذ(ة) بمدرسة ابتدائية عمومية بإقليم مديونة.
المطلوب: صياغة إشعار قصير ثنائي اللغة (فرنسية بسيطة + عربية) لدفتر المراسلة يدعو الأسر لتشجيع 10 دقائق من القراءة اليومية في المنزل بأسلوب ودي ومحترم.`,
    draftOutputTitle: bi("Mot cahier de liaison bilingue", "إشعار ثنائي اللغة لدفتر المراسلة"),
    draftOutputFr: `Chers parents, afin d'aider votre enfant à progresser en lecture, nous vous invitons à partager avec lui/elle 10 minutes de lecture à voix haute chaque soir. Votre encouragement quotidien fait toute la différence. Merci pour votre collaboration.`,
    draftOutputAr: `أمهات وآباء التلاميذ الأعزاء، لدعم تقدم أبنائكم في القراءة، ندعوكم لتخصيص 10 دقائق يومياً بالمنزل للقراءة بصوت مسموع وتشجيعهم. مشاركتكم اليومية تصنع فرقاً كبيراً. شكراً لتعاونكم.`,
    teacherCheck: bi(
      "Relire et adapter les horaires ou modalités propres à votre établissement avant impression.",
      "مراجعة المضمون وتكييف التوقيت أو الصيغة حسب ظروف مؤسستكم قبل الطباعة."
    ),
    printable: true,
  },
];

export const WEAK_VS_STRONG_PROMPT = {
  weak: {
    label: bi("Prompt faible (trop vague)", "توجيه ضعيف (عام جداً)"),
    promptFr: "Donne-moi un exercice de français pour le primaire.",
    promptAr: "أعطني تمريناً في اللغة الفرنسية للتعليم الابتدائي.",
    issues: [
      bi("Aucun niveau précisé (1AEP ou 6AEP ?)", "لم يُحدَّد المستوى الدراسي (الأول أم السادس؟)"),
      bi("Aucun objectif d'apprentissage ni compétence ciblée", "غياب الهدف التعلمي والكفاية المستهدفة"),
      bi(
        "Ne tient pas compte de la classe (effectif, supports disponibles)",
        "لا يراعي واقع القسم (عدد التلاميذ والوسائل المتاحة)"
      ),
      bi(
        "Format flou : risque d'un texte trop long ou inadapté",
        "شكل غير محدد: احتمال إنتاج نص طويل أو غير ملائم"
      ),
    ],
  },
  strong: {
    label: bi(
      "Prompt fort (prêt pour la classe à Mediouna)",
      "توجيه قوي (جاهز للقسم بمديونة)"
    ),
    promptFr: `Rôle : Enseignant expérimenté du primaire marocain.
Contexte : Classe de 4AEP à Mediouna, 36 élèves, vidéoprojecteur + cahiers, niveau hétérogène.
Objectif fourni : Identifier le sujet et le verbe dans une phrase simple au présent.
Compétence : Analyser et construire des phrases simples correctes.
Tâche : Crée 1 mini-texte de 5 phrases sur la vie scolaire puis 6 phrases d'application graduées en 3 niveaux (Base, Intermédiaire, Défi).
Contraintes : Vocabulaire simple, phrases de 6 à 9 mots maximum, aucune donnée personnelle, ton encourageant.
Format : Texte projetable + exercices en 3 blocs + corrigé enseignant à part.
Critères de qualité : Consignes brèves, pas d'ambiguïté grammaticale, prêt à relire et valider par l'enseignant.`,
    promptAr: `الدور: أستاذ(ة) متمرس(ة) بالتعليم الابتدائي المغربي.
السياق: قسم الرابع ابتدائي بمديونة، 36 تلميذاً، مسلاط عاكس ودفاتر، مستوى متفاوت.
الهدف المحدد: تحديد الفاعل والفعل في جملة بسيطة في الحاضر.
الكفاية: تحليل وبناء جمل بسيطة سليمة.
المطلوب: نص قصير من 5 جمل حول الحياة المدرسية متبوع بـ 6 جمل تطبيقية متدرجة (أساسي، متوسط، تحدي).
الشروط: معجم بسيط، جمل قصيرة (6–9 كلمات)، بدون معطيات شخصية.
الشكل: نص قابل للعرض + تمارين في 3 مجموعات + تصحيح للأستاذ(ة).
معايير الجودة: تعليمات موجزة وقابلة للمراجعة والاعتماد.`,
    strengths: [
      bi("Niveau (4AEP) et réalité matérielle explicites", "تحديد المستوى (4AEP) والواقع المادي بوضوح"),
      bi(
        "Objectif d'apprentissage et compétence fournis par l'enseignant",
        "تزويد الهدف التعلمي والكفاية من طرف الأستاذ(ة)"
      ),
      bi(
        "Différenciation claire en 3 niveaux (Base / Intermédiaire / Défi)",
        "تفريق واضح في 3 مستويات (أساسي / متوسط / تحدي)"
      ),
      bi(
        "Format directement projetable ou imprimable + mention de validation",
        "صيغة جاهزة للعرض أو الطباعة مع التنبيه للمراجعة"
      ),
    ],
  },
};

export const META_PROMPT_EXAMPLES = {
  fr: {
    title: bi("Exemple en Français (Méta-Prompt)", "نموذج بالفرنسية (Meta-Prompt)"),
    roughIdea:
      "Je veux préparer une activité de mathématiques sur les fractions pour mes élèves de 5AEP qui bloquent encore.",
    metaPrompt: `Tu es un conseiller pédagogique spécialisé dans l'enseignement primaire marocain.
Je veux créer une activité de remédiation sur les fractions simples pour une classe de 5AEP.
Avant de générer l'activité ou le code :
1. Identifie les informations manquantes dans ma demande (niveau réel des élèves, équipement en classe, durée, format souhaité).
2. Pose-moi 5 questions courtes et précises.
3. Attends mes réponses avant de proposer un plan d'activité ou un prototype prêt à tester.`,
  },
  ar: {
    title: bi("Exemple en Arabe (Méta-Prompt)", "نموذج باللغة العربية (Meta-Prompt)"),
    roughIdea:
      "أريد إعداد نشاط قرائي تفاعلي لتلاميذ المستوى الثاني ابتدائي الذين يخلطون بين بعض الحروف المتشابهة.",
    metaPrompt: `أنت خبير بيداغوجي في التعليم الابتدائي المغربي.
أريد تصميم نشاط علاجي تفاعلي للقراءة لتلاميذ المستوى الثاني ابتدائي (2AEP).
قبل أن تنتج المحتوى أو الكود:
1. حدد المعلومات الناقصة في طلبي (الحروف المستهدفة، مستوى التلاميذ الفعلي، الوسائل المتوفرة في القسم: سبورة، مسلاط عاكس، أو أوراق مطبوعة).
2. اطرح عليّ 5 أسئلة دقيقة ومختصرة.
3. انتظر إجاباتي ثم اقترح نسخة أولية بسيطة ومناسبة لقسمي لمراجعتها وتجريبها.`,
  },
};

export const DEMO_QUIZ_QUESTIONS = [
  {
    id: "dq1",
    question: bi(
      "Pourquoi Karim et sa sœur Salma se lèvent-ils tôt le samedi matin ?",
      "لماذا استيقظ كريم وأخته سلمى باكراً صباح يوم السبت؟"
    ),
    options: [
      bi("Pour partir en voyage à Agadir", "للسفر إلى مدينة أكادير"),
      bi(
        "Pour retrouver le jardinier et planter des menthes et oliviers à l'école",
        "للالتحاق بالبستاني وغرس النعناع والزيتون في حديقة المدرسة"
      ),
      bi("Pour passer un examen de mathématiques", "لاجتياز امتحان في الرياضيات"),
    ],
    correctIndex: 1,
    explanation: bi(
      "Dans le deuxième paragraphe : ils retrouvent leurs camarades et le jardinier pour planter de la menthe verte, du basilic et un jeune olivier dans la cour de l'école.",
      "في الفقرة الثانية: يلتحقان بزملائهما والبستاني لغرس النعناع والريحان وشجيرة زيتون في ساحة المدرسة."
    ),
  },
  {
    id: "dq2",
    question: bi(
      "Que prennent-ils avec eux avant de partir ?",
      "ماذا أخذا معهما قبل الانطلاق إلى المدرسة؟"
    ),
    options: [
      bi(
        "Des cahiers, des règles et des dictionnaires",
        "دفاتر ومساطر ومعاجم"
      ),
      bi(
        "Deux arrosoirs légers et des étiquettes bilingues arabe/français",
        "مرشّين خفيفين وبطاقات ثنائية اللغة بالعربية والفرنسية"
      ),
      bi("Un ordinateur portable et une caméra", "حاسوباً محمولاً وكاميرا"),
    ],
    correctIndex: 1,
    explanation: bi(
      "Le premier paragraphe mentionne explicitement deux arrosoirs légers et des étiquettes préparées en arabe et en français.",
      "تذكر الفقرة الأولى بوضوح مرشّين خفيفين وبطاقات مُعدّة بالعربية والفرنسية."
    ),
  },
  {
    id: "dq3",
    question: bi(
      "Quel mot du texte a le même sens que « arroser doucement » ?",
      "ما العبارة التي تعني «السقي برفق» في النص؟"
    ),
    options: [
      bi("Verser en pluie fine", "السكب كرذاذ خفيف (Verser en pluie fine)"),
      bi("Courir rapidement", "الجري بسرعة"),
      bi("Couper les feuilles", "قطع الأوراق"),
    ],
    correctIndex: 0,
    explanation: bi(
      "« Verser en pluie fine » décrit un arrosage délicat qui protège les jeunes racines.",
      "تصف العبارة سقياً لطيفاً يحمي الجذور الصغيرة."
    ),
  },
  {
    id: "dq4",
    question: bi(
      "Combien d'espèces différentes ont-ils plantées avec leurs camarades ?",
      "كم نوعاً مختلفاً من النباتات غرسوا مع زملائهم؟"
    ),
    options: [
      bi("Deux espèces", "نوعان اثنان"),
      bi(
        "Trois espèces (menthe, basilic et un jeune olivier)",
        "ثلاثة أنواع (النعناع والريحان وشجيرة زيتون)"
      ),
      bi("Dix espèces", "عشرة أنواع"),
    ],
    correctIndex: 1,
    explanation: bi(
      "Le texte cite trois variétés : la menthe verte, du basilic et un jeune olivier.",
      "يذكر النص ثلاثة أصناف: النعناع الأخضر والريحان وشجيرة زيتون."
    ),
  },
  {
    id: "dq5",
    question: bi(
      "Quelle est l'idée principale de ce texte ?",
      "ما الفكرة الرئيسية لهذا النص؟"
    ),
    options: [
      bi(
        "La coopération des élèves pour embellir et prendre soin de l'école",
        "تعاون التلاميذ لتزيين المدرسة والعناية بمحيطها"
      ),
      bi(
        "La recette traditionnelle du thé à la menthe",
        "طريقة تحضير الشاي التقليدي بالنعناع"
      ),
      bi("Une histoire fantastique dans l'espace", "قصة خيالية في الفضاء"),
    ],
    correctIndex: 0,
    explanation: bi(
      "Tout le récit met en valeur l'entraide, l'observation du vivant et la fierté partagée à l'école.",
      "يبرز النص كله قيمة التعاون، وملاحظة الطبيعة، والاعتزاز المشترك بالفضاء المدرسي."
    ),
  },
];

export const DEMO_QUIZ_TEXT = {
  title: bi(
    "Un samedi matin au jardin de l'école",
    "صباح يوم السبت في حديقة المدرسة"
  ),
  grade: bi(
    "4AEP · Compréhension de l'écrit",
    "الرابع ابتدائي (4AEP) · فهم المقروء"
  ),
  paragraphsFr: [
    "Ce samedi matin, le soleil brille doucement sur la cour de l'école à Mediouna. Karim et sa sœur Salma arrivent tôt avec deux arrosoirs légers et des étiquettes préparées en arabe et en français.",
    "Avec leurs camarades et leur enseignante, ils retrouvent le jardinier pour planter trois variétés : de la menthe verte, du basilic et un jeune olivier. Salma creuse avec précaution pendant que Karim verse l'eau en pluie fine pour ne pas abîmer les racines.",
    "À midi, chaque classe accroche son étiquette bilingue et s'engage à arroser le carré vert toute la semaine. Tous repartent fiers d'avoir transformé un coin de terre en petite classe de sciences à ciel ouvert.",
  ],
  paragraphsAr: [
    "في صباح يوم السبت، أشرقت الشمس بهدوء على ساحة المدرسة بمديونة. وصل كريم وأخته سلمى باكراً ومعهما مرشّان خفيفان وبطاقات مكتوبة بالعربية والفرنسية.",
    "مع زملائهما وأستاذتهما، التحقا بالبستاني لغرس ثلاثة أصناف: النعناع الأخضر، والريحان، وشجيرة زيتون صغيرة. حفرت سلمى التربة بعناية بينما سكب كريم الماء كرذاذ خفيف حفاظاً على الجذور.",
    "عند الزوال، علّق كل قسم بطاقته الثنائية اللغة والتزم بسقي الحوض الأخضر طوال الأسبوع، وعاد الجميع فخورين بتحويل ركن من الساحة إلى قسم مفتوح للنشاط العلمي.",
  ],
  sourcePromptFr: `Rôle : Enseignant de 4AEP au Maroc.
Objectif : Évaluer la compréhension littérale et inférentielle d'un court récit.
Tâche : Crée une mini-application HTML/CSS/JS autonome (utilisable hors ligne au vidéoprojecteur) affichant un texte de 3 courts paragraphes sur la vie scolaire au Maroc, suivi de 5 QCM avec correction immédiate, explication pédagogique, score final et bouton « Recommencer ».
Contraintes : Grande lisibilité (tableau/projecteur), zéro compte élève, zéro appel réseau externe.`,
  sourcePromptAr: `الدور: أستاذ(ة) المستوى الرابع ابتدائي بالمغرب.
الهدف: تقويم الفهم الصريح والضمني لنص سردي قصير.
المطلوب: إنشاء تطبيق ويب مصغر مستقل (HTML/CSS/JS) يعمل بدون إنترنت على المسلاط العاكس، يعرض نصاً من 3 فقرات حول الحياة المدرسية متبوعاً بـ 5 أسئلة اختيار من متعدد مع تصحيح فوري، وتفسير بيداغوجي، ونتيجة نهائية، وزر «إعادة المحاولة».
الشروط: خط كبير واضح للقراءة من آخر القسم، بدون حسابات للتلاميذ وبدون اتصال خارجي.`,
};
