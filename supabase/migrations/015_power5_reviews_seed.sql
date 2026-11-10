-- ============================================================
-- 015_power5_reviews_seed.sql
-- Seed reviews collected from the Power 5 workshop (Sept–Oct 2026).
-- The Power 5 was a three-session program covering:
--   • Web development with AI / top-down approach (Sep 26–28)
--   • LLMs, context engineering, and chatbots (Sep 27–28)
--   • n8n automation + CV-recruitment bot (Oct 11–16)
-- All reviews are pre-approved (admin added them manually, not via the
-- public form), tagged to brand = 'skillsync', workshop_or_service =
-- 'Power 5 Workshop'. Submitted-at timestamps match each comment's date.
--
-- Idempotent: each INSERT skips if a row with the same reviewer_name +
-- opening phrase already exists. Safe to re-run.
-- ============================================================

-- Convenience: insert one review only if it doesn't exist yet.
-- Deduplication key = (reviewer_name, first 80 chars of body).
CREATE OR REPLACE FUNCTION pg_temp.seed_power5_review(
  p_name  text,
  p_body  text,
  p_rating int,
  p_date  text
) RETURNS void AS $$
BEGIN
  INSERT INTO public.reviews (
    reviewer_name, reviewer_role, workshop_or_service,
    rating, body, brand,
    is_approved, is_featured, submitted_at
  )
  SELECT
    p_name, 'Workshop Attendee', 'Power 5 Workshop',
    p_rating, p_body, 'skillsync',
    true, false, p_date::timestamptz
  WHERE NOT EXISTS (
    SELECT 1 FROM public.reviews
    WHERE reviewer_name = p_name
      AND left(body, 80) = left(p_body, 80)
  );
END;
$$ LANGUAGE plpgsql;

-- ────────────────────────────────────────────────────────────
-- SESSION 1 · Web Development with AI (Sep 26 – Sep 28)
-- ────────────────────────────────────────────────────────────

SELECT pg_temp.seed_power5_review(
  'Ayesha Munawar Hashmi',
  'WebDev was my childhood dream till AI came in and there were talks everywhere how web developers would not be needed — until I recently discovered how I can use AI to maximize my output and actually use it to help me develop top-notch websites. Web Development has never been easier.',
  5, '2026-09-26 18:00:00+05'
);

SELECT pg_temp.seed_power5_review(
  'Esha Toor',
  'Before these few hours, I had almost no experience with web development, but now I feel much more comfortable with the idea of making a website. I think I could work on and deploy a website for an online clothing store, especially now that I understand the basic process and know where to start. What surprised me most was how much can be done in just a few hours — going from knowing almost nothing to actually building something gave me a lot of confidence. I definitely don''t regret joining — it made web development feel much more approachable and gave me the motivation to explore it further.',
  5, '2026-09-27 18:00:00+05'
);

SELECT pg_temp.seed_power5_review(
  'Hadi Amer',
  'I am comfortable in making a website but still have a few doubts regarding its security features. These few hours have improved my vision and understanding by a great margin — I have come to know how to connect and integrate backend with frontend and how to deploy my site. The top-down approach is very great for setting up a great headstart pace and giving us confidence to do the work.',
  5, '2026-09-28 18:00:00+05'
);

SELECT pg_temp.seed_power5_review(
  'Izza Maryam',
  'At first, I thought making a website was a very big deal, but after taking the session from SkillSync, I realized it is very easy. These few hours made me learn a lot of things that I never realized I needed to learn. The session was very interesting and interactive enough to build my interest in this field. I would never regret my decision of joining this session. I am in favor of the top-down approach because it makes you build something that keeps you interested.',
  5, '2026-09-28 18:00:00+05'
);

SELECT pg_temp.seed_power5_review(
  'Muhammad Adeel Pervez',
  'After taking the web dev session I got to know a lot of web dev terminologies which will help me in creating a website through vibe coding. These hours helped me in learning a full web dev process. It also makes me good at prompting for websites because now I know a lot of web dev concepts. It helps me in learning from mistakes — I have to do big things which compel me to make mistakes and then learn from them.',
  5, '2026-09-27 18:00:00+05'
);

SELECT pg_temp.seed_power5_review(
  'Muhammad Mohsin',
  'Honestly web development left me feeling a little confused at first — I initially thought Claude would handle everything for us. Later I discovered that Claude Code can actually do a lot more on its own. Overall this was useful but I know I need a lot more practice before I would call myself comfortable with web development. I do not regret joining — it gave me a starting point I would not have had otherwise.',
  4, '2026-09-27 18:00:00+05'
);

SELECT pg_temp.seed_power5_review(
  'Muhammad Pasha',
  'I am comfortable making a website now, and I feel confident that I could deploy a website for an online clothing store. I am also planning to continue learning more about web development. Going from knowing almost nothing to building something in just a few hours was surprising, and it showed me that I can learn and apply things quickly. The top-down approach gives you confidence because you are able to see the bigger picture and realize that you can actually build something from the first day.',
  5, '2026-09-28 18:00:00+05'
);

SELECT pg_temp.seed_power5_review(
  'Muhammad Yasir Suhail',
  'Yes, I can easily deploy websites now. It was a fun experience especially because I have made websites before but never deployed them. It was still fun learning new things like deployment and how to add sign-in with Google functionality. If you properly decide the main architecture of your website before prompting your AI tool, it will easily make the website properly once instead of handling so many errors later. Top-down approach really did help — with the right tricks and tools and prompts you can easily make a website in very less time.',
  5, '2026-09-27 18:00:00+05'
);

SELECT pg_temp.seed_power5_review(
  'Rafay Khan',
  'After attending this workshop, I am comfortable making a website on my own. I am also confident that I can build and deploy a website for an online clothing store. Going from knowing nothing to building something new in just a few hours felt amazing. In my opinion, the top-down approach is the best way to learn — although it brings some doubts, building things practically helps us learn from our mistakes and gave us confidence from the very first day. I do not regret joining at all and I am proud of myself for being part of this.',
  5, '2026-09-27 18:00:00+05'
);

SELECT pg_temp.seed_power5_review(
  'Zeeshan Azeem',
  'I really enjoyed this session of SkillSync, especially when I came to n8n automation. I always wanted to try out n8n but never got the time or proper guidance (YouTube is full of crap tutorials). I built 2 projects with n8n guided completely by Minahal and then went out on my own and built a Telegram automation chatbot for SkillSync. I already kind of knew how to build websites and deploy them (even did an internship in Web engineering before), so that part wasn''t new to me.',
  5, '2026-09-27 18:00:00+05'
);

-- ────────────────────────────────────────────────────────────
-- SESSION 2 · LLMs, Context Engineering & Chatbots (Sep 27 – Oct 14)
-- ────────────────────────────────────────────────────────────

SELECT pg_temp.seed_power5_review(
  'Esha Toor',
  'Before these few hours, I had very little understanding of LLMs and context engineering, but now I feel much more comfortable with the basic concepts and how they work together when building a chatbot. Overall, the session was genuinely exciting because I got to go from knowing almost nothing to actually building and hosting a working chatbot. I now feel confident that I can start building one, figure things out, and learn along the way. The experience also made LLM development feel much less intimidating and showed me that I can actually create something with it.',
  5, '2026-09-27 19:00:00+05'
);

SELECT pg_temp.seed_power5_review(
  'Hadi Amer',
  'I really liked exploring context engineering and concepts of LLM. The way temperature and system-prompt restrictions change the response is definitely worthy to be learnt in this era. I learned a lot about hosting a chatbot through GitHub and not just by buying domains. I am confident of using context engineering to restrict what a chatbot does. Overall I would say it was worth attending.',
  5, '2026-09-27 19:00:00+05'
);

SELECT pg_temp.seed_power5_review(
  'Izza Maryam',
  'Honestly, building the chatbot was way easier than I expected going in. As a first-semester student, I didn''t know much about LLMs or context engineering before this, so I was a little nervous — but it turned out to be genuinely fun, exciting, and really informative. Watching everything come together in just a few hours felt almost magical, going from knowing literally nothing to actually having a working chatbot hosted and running. It was absolutely worth attending — it helped me learn new concepts and I made my very first working project.',
  5, '2026-09-27 19:00:00+05'
);

SELECT pg_temp.seed_power5_review(
  'Muhammad Adeel Pervez',
  'After taking this session I got to know what LLMs and context engineering actually are. After these few hours I am feeling more confident because now I know many things related to chatbots. Now I know how to host bots and other related things. I am lucky that I attended this session because I learnt a lot of things in a very friendly environment.',
  5, '2026-09-28 19:00:00+05'
);

SELECT pg_temp.seed_power5_review(
  'Muhammad Mohsin',
  'Honestly I learned new things that were unknown to me before, but at the same time the sheer amount of information made me a little confused. There were many different tools, each with its own way of working. I do plan to keep learning more about LLMs and context engineering. Spending these hours was truly worth it because it answered questions I had about how LLMs are trained and how these systems work — but I feel I still need to understand the concepts more.',
  4, '2026-09-27 19:00:00+05'
);

SELECT pg_temp.seed_power5_review(
  'Muhammad Noraiz Waseem',
  'Yeah, I am comfortable with the basic concepts of LLM and will try to do more with this.',
  5, '2026-10-14 19:00:00+05'
);

SELECT pg_temp.seed_power5_review(
  'Muhammad Pasha',
  'Yes, I am comfortable with the concepts of LLM and have a better understanding of context engineering. This session has opened new horizons for me. These few hours allowed for impartation of knowledge on how to customize any LLM.',
  5, '2026-09-28 19:00:00+05'
);

SELECT pg_temp.seed_power5_review(
  'Muhammad Yasir Suhail',
  'Through the template provided, I can build any kind of chatbot. Overall, I would say it was a fun session and I learned a lot of new things, like how to get free APIs of some AI models and how to build your own chatbot through that. It was a good experience. I also learnt a little bit about how guardrails are implemented. I think it was a great experience from knowing nothing to making my own chatbot.',
  4, '2026-09-27 19:00:00+05'
);

SELECT pg_temp.seed_power5_review(
  'Rafay Khan',
  'Honestly, I''m now pretty comfortable with the concepts of LLMs and context engineering. Before this session I barely knew anything about them, so going from knowing nothing to actually building my own chatbot and hosting it in just a few hours felt amazing. It was totally worth attending. The whole thing got me really excited and I''ve become genuinely interested in making creative stuff like this. A big thank you to my teacher for putting in so much effort and making everything so clear for us.',
  5, '2026-09-27 19:00:00+05'
);

-- ────────────────────────────────────────────────────────────
-- SESSION 3 · n8n Automation + CV Recruitment Bot (Oct 11 – Oct 16)
-- ────────────────────────────────────────────────────────────

SELECT pg_temp.seed_power5_review(
  'Hadi Amer',
  'I am very much comfortable with using n8n now. This was an amazing workshop and I am genuinely excited to do more with it. I would say it is worth attending, and the final project of the CV recruitment auto-bot helped a lot in becoming confident. If I were to do it alone without the workshop I would probably have done only 30 to 40% as much as I have done by attending. I would prefer to get a headstart with your workshop — now once I have understood how the general n8n environment works I can work on polishing my skills further on my own.',
  5, '2026-10-11 20:00:00+05'
);

SELECT pg_temp.seed_power5_review(
  'Muhammad Noraiz Waseem',
  'Mam, overall the course was really informative.',
  5, '2026-10-14 20:00:00+05'
);

SELECT pg_temp.seed_power5_review(
  'Muhammad Pasha',
  'Yes, after making these projects — especially after the final project — I can say I can make new projects, especially not limiting to general tools like Google Forms but my own customized ones.',
  5, '2026-10-16 20:00:00+05'
);

SELECT pg_temp.seed_power5_review(
  'Muhammad Yasir Suhail',
  'It was obviously worth it. I knew a little bit before about automation, and I always thought that it was a cool skill to learn. I even tried making an automation before but was unable to because connecting different accounts with n8n was something I was unable to do. But now I am confident that I can make good automations and connect my accounts with n8n easily. I am pretty comfortable with it, and I will try to dive deep into concepts like using AI models in n8n.',
  5, '2026-10-13 20:00:00+05'
);

-- ============================================================
-- Totals: 23 reviews across 3 sessions, 10 unique attendees.
-- ============================================================
