-- AI Teacher Lab · Atelier Provincial de Mediouna
-- Seed Workshop, Activities & Isolated Demo Mode Dataset (is_demo = true)

do $$
declare
  v_workshop_id uuid;
  v_act_needs uuid;
  v_act_genai uuid;
  v_act_resp uuid;
  v_act_prompt uuid;
  v_act_meta uuid;
  v_act_proj uuid;
  v_act_show uuid;
  v_act_exit uuid;
  v_p_ids uuid[];
  v_names text[] := array[
    'Khadija B.', 'Youssef E.', 'Fatima Z.', 'Rachid M.', 'Amina H.', 'Hassan K.',
    'Nadia S.', 'Karim T.', 'Salma R.', 'Omar L.', 'Latifa N.', 'Abdellah C.',
    'Siham A.', 'Mustapha D.', 'Hanane F.', 'Brahim O.', 'Meryem G.', 'Tariq J.'
  ];
  v_i integer;
  v_pid uuid;
  v_needs_opts text[] := array[
    'prep', 'diff', 'diff', 'eval', 'corr', 'admin', 'interactive', 'prep', 'diff',
    'interactive', 'eval', 'prep', 'corr', 'diff', 'interactive', 'admin', 'prep', 'diff'
  ];
  v_proj_opts text[] := array[
    'group1', 'group2', 'group3', 'group4', 'group3', 'group1', 'group2', 'group4',
    'group3', 'group1', 'group3', 'group2', 'group4', 'group1', 'group3', 'group2', 'group4', 'group3'
  ];
begin
  -- Upsert workshop (default PIN hash corresponds to '202604'; server syncs WORKSHOP_PIN hash automatically)
  insert into public.workshops (slug, title, join_pin_hash, is_active)
  values (
    'mediouna-ai-teacher-lab',
    'AI Teacher Lab · Atelier Provincial de Mediouna',
    encode(digest('202604', 'sha256'), 'hex'),
    true
  )
  on conflict (slug) do update set title = excluded.title
  returning id into v_workshop_id;

  insert into public.workshop_state (
    workshop_id, current_slide_id, current_section, active_activity_key,
    activity_status, show_results, show_qr_overlay, is_paused, demo_mode
  )
  values (
    v_workshop_id, 's01-welcome', 1, null, 'idle', false, true, false, false
  )
  on conflict (workshop_id) do nothing;

  -- Upsert 8 canonical activities
  insert into public.activities (workshop_id, activity_key, section_number, activity_type, title) values
    (v_workshop_id, 'poll-needs', 2, 'poll', 'Besoins prioritaires des collègues'),
    (v_workshop_id, 'quiz-genai', 3, 'mcq_quiz', 'Quiz : Comprendre l''IA générative'),
    (v_workshop_id, 'quiz-responsible', 5, 'tf_quiz', 'Vrai ou Faux : IA responsable en classe'),
    (v_workshop_id, 'builder-prompt', 6, 'prompt_builder', 'Atelier Prompt Builder 1AEP–6AEP'),
    (v_workshop_id, 'exercise-metaprompt', 7, 'meta_prompt', 'Exercice Méta-Prompt FR / AR'),
    (v_workshop_id, 'vote-project', 10, 'project_vote', 'Choix du projet d''application'),
    (v_workshop_id, 'vote-showcase', 11, 'showcase_vote', 'Votes Showcase des groupes'),
    (v_workshop_id, 'exit-ticket', 12, 'exit_ticket', 'Engagement de la semaine')
  on conflict (workshop_id, activity_key) do update set title = excluded.title;

  select id into v_act_needs from public.activities where workshop_id = v_workshop_id and activity_key = 'poll-needs';
  select id into v_act_genai from public.activities where workshop_id = v_workshop_id and activity_key = 'quiz-genai';
  select id into v_act_resp from public.activities where workshop_id = v_workshop_id and activity_key = 'quiz-responsible';
  select id into v_act_prompt from public.activities where workshop_id = v_workshop_id and activity_key = 'builder-prompt';
  select id into v_act_meta from public.activities where workshop_id = v_workshop_id and activity_key = 'exercise-metaprompt';
  select id into v_act_proj from public.activities where workshop_id = v_workshop_id and activity_key = 'vote-project';
  select id into v_act_show from public.activities where workshop_id = v_workshop_id and activity_key = 'vote-showcase';
  select id into v_act_exit from public.activities where workshop_id = v_workshop_id and activity_key = 'exit-ticket';

  -- Clean existing demo rows idempotently before re-seeding
  delete from public.gallery_contributions where workshop_id = v_workshop_id and is_demo = true;
  delete from public.participants where workshop_id = v_workshop_id and is_demo = true;

  v_p_ids := array[]::uuid[];
  for v_i in 1..array_length(v_names, 1) loop
    insert into public.participants (workshop_id, display_name, session_token_hash, is_demo, last_seen_at)
    values (
      v_workshop_id,
      v_names[v_i],
      encode(digest('demo-mediouna-' || v_i::text, 'sha256'), 'hex'),
      true,
      now() - ((v_i % 5) * interval '10 seconds')
    )
    returning id into v_pid;
    v_p_ids := array_append(v_p_ids, v_pid);
  end loop;

  -- Seed Demo Mode responses
  for v_i in 1..array_length(v_p_ids, 1) loop
    v_pid := v_p_ids[v_i];

    -- Needs poll
    insert into public.responses (workshop_id, activity_id, participant_id, item_key, selected_option, is_demo)
    values (v_workshop_id, v_act_needs, v_pid, 'main', v_needs_opts[v_i], true);

    -- Project vote
    insert into public.responses (workshop_id, activity_id, participant_id, item_key, selected_option, is_demo)
    values (v_workshop_id, v_act_proj, v_pid, 'main', v_proj_opts[v_i], true);

    -- GenAI 5-question MCQ (answers: q1=b, q2=c, q3=b, q4=a, q5=c)
    insert into public.responses (workshop_id, activity_id, participant_id, item_key, selected_option, is_correct, is_demo) values
      (v_workshop_id, v_act_genai, v_pid, 'q1', case when v_i % 5 = 0 then 'a' else 'b' end, v_i % 5 <> 0, true),
      (v_workshop_id, v_act_genai, v_pid, 'q2', case when v_i % 4 = 0 then 'b' else 'c' end, v_i % 4 <> 0, true),
      (v_workshop_id, v_act_genai, v_pid, 'q3', case when v_i % 6 = 0 then 'a' else 'b' end, v_i % 6 <> 0, true),
      (v_workshop_id, v_act_genai, v_pid, 'q4', case when v_i % 7 = 0 then 'c' else 'a' end, v_i % 7 <> 0, true),
      (v_workshop_id, v_act_genai, v_pid, 'q5', case when v_i % 5 = 0 then 'b' else 'c' end, v_i % 5 <> 0, true);

    -- Responsible AI 5-question True/False (answers: tf1=false, tf2=true, tf3=false, tf4=false, tf5=true)
    insert into public.responses (workshop_id, activity_id, participant_id, item_key, selected_option, is_correct, is_demo) values
      (v_workshop_id, v_act_resp, v_pid, 'tf1', case when v_i % 6 = 0 then 'true' else 'false' end, v_i % 6 <> 0, true),
      (v_workshop_id, v_act_resp, v_pid, 'tf2', 'true', true, true),
      (v_workshop_id, v_act_resp, v_pid, 'tf3', case when v_i % 5 = 0 then 'true' else 'false' end, v_i % 5 <> 0, true),
      (v_workshop_id, v_act_resp, v_pid, 'tf4', case when v_i % 4 = 0 then 'true' else 'false' end, v_i % 4 <> 0, true),
      (v_workshop_id, v_act_resp, v_pid, 'tf5', 'true', true, true);

    -- Showcase votes (3 categories)
    insert into public.responses (workshop_id, activity_id, participant_id, item_key, selected_option, is_demo) values
      (v_workshop_id, v_act_show, v_pid, 'most_useful', case when v_i % 3 = 0 then 'group3' when v_i % 2 = 0 then 'group1' else 'group2' end, true),
      (v_workshop_id, v_act_show, v_pid, 'best_pedagogy', case when v_i % 2 = 0 then 'group3' else 'group4' end, true),
      (v_workshop_id, v_act_show, v_pid, 'most_creative', case when v_i % 3 = 0 then 'group2' when v_i % 2 = 0 then 'group4' else 'group1' end, true);
  end loop;

  -- Seed sample Prompt Builder, Meta-Prompt, Exit Tickets
  insert into public.responses (workshop_id, activity_id, participant_id, item_key, selected_option, payload, is_demo) values
    (v_workshop_id, v_act_prompt, v_p_ids[1], 'main', '4AEP · Français',
      jsonb_build_object(
        'grade', '4AEP',
        'subject', 'Français',
        'objective', 'Identifier les personnages et les actions principales d''un récit court',
        'assembledPrompt', 'Rôle : Conseiller pédagogique du primaire marocain. Contexte : Classe de 4AEP à effectif chargé à Mediouna. Tâche : Rédiger un texte court de 8 lignes avec 5 questions graduées (3 niveaux).'
      ), true),
    (v_workshop_id, v_act_prompt, v_p_ids[2], 'main', '3AEP · Mathématiques',
      jsonb_build_object(
        'grade', '3AEP',
        'subject', 'Mathématiques',
        'objective', 'Décomposer un nombre à trois chiffres en centaines, dizaines et unités',
        'assembledPrompt', 'Rôle : Enseignant du primaire. Public : Élèves de 3AEP en difficulté de numération. Tâche : Créer 6 exercices progressifs avec représentation visuelle C/D/U et fiche imprimable.'
      ), true),
    (v_workshop_id, v_act_meta, v_p_ids[3], 'main', 'fr',
      jsonb_build_object(
        'language', 'fr',
        'roughIdea', 'Je veux une activité pour mes élèves de 2AEP qui confondent les lettres ب / ت / ث',
        'metaPrompt', 'Avant de créer l''activité, pose-moi 5 questions précises sur le niveau réel de mes élèves de 2AEP, le temps disponible et le support (tableau ou fiche).'
      ), true),
    (v_workshop_id, v_act_exit, v_p_ids[1], 'main', 'diff',
      jsonb_build_object('category', 'diff', 'commitment', 'Créer 3 fiches graduées (Base / Intermédiaire / Défi) pour ma séance de lecture de jeudi en 4AEP.'), true),
    (v_workshop_id, v_act_exit, v_p_ids[2], 'main', 'app',
      jsonb_build_object('category', 'app', 'commitment', 'Tester le générateur de décomposition des nombres sur le projecteur de l''école avec mes élèves de 3AEP.'), true),
    (v_workshop_id, v_act_exit, v_p_ids[3], 'main', 'meta',
      jsonb_build_object('category', 'meta', 'commitment', 'Utiliser le méta-prompt en arabe pour préparer une séance de remédiation en décodage (1AEP-2AEP).'), true),
    (v_workshop_id, v_act_exit, v_p_ids[4], 'main', 'eval',
      jsonb_build_object('category', 'eval', 'commitment', 'Concevoir un ticket de sortie rapide de 5 questions pour repérer les erreurs fréquentes en fractions (5AEP).'), true);

  -- Seed sample Demo Provincial Gallery contributions
  insert into public.gallery_contributions (
    workshop_id, participant_id, contributor_name, app_title, grade_range, discipline,
    language, learning_objective, description, classroom_instructions, app_resource,
    tested_features, privacy_confirmed, is_demo
  ) values
    (
      v_workshop_id, v_p_ids[1], 'Khadija B. (Démo)',
      'Lecteur Progressif 4AEP', '4AEP', 'Français', 'Français (LTR)',
      'Lire un court récit du quotidien et répondre à 5 questions de compréhension.',
      'Mini-application légère projetable en classe avec texte aéré, 5 questions à choix multiples et explications immédiates.',
      'Projeter le texte 5 minutes, faire voter la classe à main levée puis afficher la correction commentée.',
      'Prototype interne · /screen (Démonstration Section 9)',
      '["Mode hors ligne", "Feedback immédiat", "Affichage projecteur"]'::jsonb,
      true, true
    ),
    (
      v_workshop_id, v_p_ids[2], 'Youssef E. (Démo)',
      'Abaque & Décomposition C/D/U', '2AEP–4AEP', 'Mathématiques', 'Bilingue FR/AR',
      'Comprendre la valeur positionnelle (centaines, dizaines, unités) par manipulation visuelle.',
      'Outil interactif sans connexion permettant de manipuler des barres et carrés sur vidéoprojecteur ou tablette partagée.',
      'Inviter un élève au tableau pour construire le nombre demandé puis vérifier en collectif.',
      'Prototype interne · Galerie Section 10',
      '["Manipulation visuelle", "3 niveaux progressifs", "Zéro compte élève"]'::jsonb,
      true, true
    ),
    (
      v_workshop_id, v_p_ids[3], 'Amina H. (Démo)',
      'Cartes Syllabes & Sons (TaRL)', '1AEP–3AEP', 'Langue Arabe', 'Arabe (RTL)',
      'Consolider la reconnaissance des voyelles courtes (فتحة، ضمة، كسرة) en début de remédiation.',
      'Cartes interactives droite-à-gauche grand format pour rituel de 10 minutes en début de séance.',
      'Lire collectivement puis faire passer les groupes selon leur niveau (Base / Intermédiaire / Défi).',
      'Prototype interne · Galerie Section 10',
      '["Support RTL arabe", "Lisible au fond de la classe", "Imprimable"]'::jsonb,
      true, true
    );
end $$;
