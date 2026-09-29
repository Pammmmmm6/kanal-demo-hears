/* =========================================================
   KANAL : démo d'automatisations WhatsApp (cas Hears)

   Mécanique d'animation reprise 1:1 de jpegsmafia.com :
   spring stiffness 400, damping 30, mass 1, entrée
   opacity 0 -> 1 + translateX ±8px, 3 points à 300 ms.

   Dans les textes, **texte** met en gras.
   ========================================================= */

(function () {
  'use strict';

  /* Vitesse de la conversation.
     1   = exactement les délais du site d'origine (~31 s au total)
     1.5 = 50 % plus rapide, 2 = deux fois plus rapide */
  var SPEED = 1.8;   /* démo volontairement rapide : le prospect doit comprendre en un coup d'œil */

  /* ---------------------------------------------------------
     1. Avatars
     --------------------------------------------------------- */
  var AVATARS = {
    hears: 'assets/avatar-hears.png',   // cœur Hears sur fond pêche
    brand: 'assets/logo.png'
  };

  /* Nom affiché à droite (la cliente du cas d'étude) */
  var VISITOR = 'Marie';

  /* ---------------------------------------------------------
     2. Les automatisations
        Une entrée par flow. La clé sert d'ancre dans l'URL
        (#abandoned-cart) et correspond au href du lien
        dans index.html.

        trigger = libellé affiché entre les deux traits
        steps   = la conversation
                  delay = attente AVANT de jouer l'étape
                  op    = typing | reply | add | you | event

        Produits, prix ($) et arguments repris de hears.com :
        Hears 20dB $43, Hears Sleep $39, Deep Sleep Mask $49,
        500 000 clients, 10 000+ avis 5 étoiles, essai 100 jours,
        4 tailles d'embouts, TPE hypoallergénique, livraison
        offerte dès $50, DHL 3 à 5 jours ouvrés.
     --------------------------------------------------------- */
  var DEFAULT_FLOW = 'abandoned-cart';
  var FLOWS = {};

  /* ===== 1. Panier abandonné ======================================== */
  FLOWS['abandoned-cart'] = { trigger: 'Abandoned cart', steps: [
    /* --- 1. Le panier abandonné déclenche le message ------------------- */
    { delay: 0,    op: 'typing', who: 'hears', label: 'Hears' },
    { delay: 2000, op: 'reply',  kind: 'card', auto: true,
      img: 'assets/hears-lifestyle.jpg', w: 1200, h: 628,
      cap: 'Hi Marie 👋\n' +
           'You left your Hears (20dB, Jet Black) in your cart last night. We’ll hold them for another 24 hours while you decide.\n\n' +
           'We have over **500,000 customers** and **10,000+ five-star reviews**. Got a question? Our support team is right here on WhatsApp.',
      buttons: [
        { label: 'Complete my order' },
        { label: 'Learn more', ghost: true }
      ] },
    { delay: 1800, op: 'you',    text: 'Learn more' },

    /* --- 2. Hears qualifie l'hésitation -------------------------------- */
    { delay: 1000, op: 'typing', who: 'hears', label: 'Hears' },
    { delay: 2000, op: 'reply',  kind: 'cta', tight: true,
      text: 'Happy to help. What would you like to know?',
      buttons: [
        { label: 'Sizing', ghost: true },
        { label: 'Shipping times', ghost: true },
        { label: '100-day trial', ghost: true }
      ] },
    { delay: 1800, op: 'you',    text: 'Sizing' },

    /* --- 3. Réponse + code promo pour débloquer l'achat ---------------- */
    { delay: 1000, op: 'typing', who: 'hears', label: 'Hears' },
    { delay: 2000, op: 'reply',  kind: 'bubble',
      text: 'Good news: your Hears come with **4 ear-tip sizes** (XS, S, M and L), so you’ll find the right fit. And you have **100 days to try them**. If they’re not for you, we’ll refund you even if you’ve worn them.' },
    { delay: 900,  op: 'add',    kind: 'cta', tight: true,
      text: 'To help you decide, here’s **10%** off your cart with code **HEARS10**.',
      buttons: [ { label: 'Get my 10% off' } ] },

    /* --- 4. Conversion ------------------------------------------------ */
    { delay: 1600, op: 'event',  kind: 'order', text: 'Order placed', amount: '$38.70' },   /* $43 moins 10% */
    { delay: 1400, op: 'you',
      text: 'Thanks for the quick reply! I just placed my order 🙂 Hope it gets here soon!' }
  ] };

  /* ===== 2. Confirmation & suivi de commande ======================== */
  FLOWS['order-confirmation'] = { trigger: 'Order confirmed', steps: [
    { delay: 0,    op: 'typing', who: 'hears', label: 'Hears' },
    { delay: 2000, op: 'reply',  kind: 'cta', tight: true,
      text: 'Thank you, Marie 🙌\n' +
            'Your order **HRS-10428** is confirmed. Your Hears (20dB, Jet Black) are in stock and we’re getting them ready to ship.',
      buttons: [
        { label: 'Track my order' },
        { label: 'Change my address', ghost: true }
      ] },
    { delay: 1800, op: 'you',    text: 'Track my order' },

    { delay: 1000, op: 'typing', who: 'hears', label: 'Hears' },
    { delay: 2000, op: 'reply',  kind: 'bubble', text: 'Of course. Here’s where your order stands:' },
    { delay: 800,  op: 'add',    kind: 'bubble',
      text: '✅ Order confirmed\n✅ Payment received\n⏳ Preparing your package' },

    { delay: 1600, op: 'event',  text: 'Shipped · DHL 1234 5678 90' },

    { delay: 1400, op: 'typing', who: 'hears', label: 'Hears' },
    { delay: 2000, op: 'reply',  kind: 'cta', tight: true,
      text: 'Your package just left our warehouse. Expected delivery: **Thursday between 9am and 1pm**.',
      buttons: [ { label: 'Track my package' } ] },
    { delay: 1800, op: 'you',    text: 'Awesome, thanks!' },

    { delay: 1600, op: 'event',  text: 'Delivered' },

    { delay: 1400, op: 'typing', who: 'hears', label: 'Hears' },
    { delay: 2000, op: 'reply',  kind: 'cta', tight: true,
      text: 'Your package has been delivered 🎉 Did you find the right ear-tip size?',
      buttons: [
        { label: 'Yes, perfect', ghost: true },
        { label: 'I need help', ghost: true }
      ] },
    { delay: 1800, op: 'you',    text: 'Yes, perfect! Wore them to a concert last night and the music was still clear, not muffled at all 👌' }
  ] };

  /* ===== 4. Agent IA ================================================
     Le scénario démarre comme le panier abandonné, puis la cliente
     pose une question hors scénario : l'agent IA prend le relais et
     joue à la fois le support et le vendeur. */
  var AI = 'Hears · AI Agent';

  FLOWS['ai-agent'] = { trigger: 'Abandoned cart', steps: [
    { delay: 0,    op: 'typing', who: 'hears', label: 'Hears' },
    { delay: 2000, op: 'reply',  kind: 'cta', tight: true,
      text: 'Hi Marie 👋\n' +
            'You left your Hears (20dB, Jet Black) in your cart. We’ll hold them for another 24 hours.',
      buttons: [
        { label: 'Complete my order' },
        { label: 'Learn more', ghost: true }
      ] },
    { delay: 1800, op: 'you',    text: 'Learn more' },

    { delay: 1000, op: 'typing', who: 'hears', label: 'Hears' },
    { delay: 2000, op: 'reply',  kind: 'cta', tight: true,
      text: 'Happy to help. What would you like to know?',
      buttons: [
        { label: 'Sizing', ghost: true },
        { label: 'Shipping times', ghost: true },
        { label: '100-day trial', ghost: true }
      ] },

    /* la cliente sort du scénario prévu */
    { delay: 2200, op: 'you',
      text: 'None of those, actually. What are the ear tips made of? My skin is really sensitive and I react to some plastics.' },

    { delay: 1600, op: 'event',
      text: 'Off-script question · the AI agent takes over' },

    { delay: 1400, op: 'typing', who: 'hears', label: AI },
    { delay: 2400, op: 'reply',  kind: 'bubble',
      text: 'Great question!\n\n' +
            'Hears ear tips are made of **TPE**, a **hypoallergenic** material suitable for sensitive skin. Our earplugs are designed and made in Europe and certified to international hearing-protection standards.\n\n' +
            'And if they’re not right for you, you have **100 days to get a refund**, even if you’ve worn them.' },
    { delay: 2000, op: 'you',    text: 'Perfect. And can I wear them to sleep? My boyfriend snores 😅' },

    { delay: 1200, op: 'typing', who: 'hears', label: AI },
    { delay: 2400, op: 'reply',  kind: 'bubble',
      text: 'The Hears 20dB in your cart are made for everyday life and concerts. They turn the volume down without shutting sound out. For sleep, we have a dedicated line designed for silent nights, even if you sleep on your side.\n\n' +
            'I think you’ll love these two:' },
    { delay: 1000, op: 'add',    kind: 'card', auto: true,
      img: 'assets/hears-sleep.jpg', w: 800, h: 800,
      cap: '**Hears Sleep** · earplugs designed for side sleepers and silent nights. **$39**',
      buttons: [ { label: 'View product' } ] },
    { delay: 1200, op: 'add',    kind: 'card', auto: true,
      img: 'assets/hears-sleep-mask.jpg', w: 800, h: 800,
      cap: '**Deep Sleep Mask** · total darkness to go with the silence. **$49**',
      buttons: [ { label: 'View product' } ] },
    { delay: 1200, op: 'add',    kind: 'bubble',
      text: 'Bonus: add Hears Sleep to your cart and your order goes over **$50**, so shipping is free.' },

    /* --- l'agent a vendu : la commande part ---------------------------- */
    { delay: 1800, op: 'event',  kind: 'order', text: 'Order placed', amount: '$82' },   /* Hears $43 + Hears Sleep $39 */
    { delay: 1400, op: 'you',    text: 'Thanks for the advice! I just placed my order.' },

    /* --- et il assure le suivi ---------------------------------------- */
    { delay: 1800, op: 'you',    text: 'By the way, when will it arrive?' },
    { delay: 1200, op: 'typing', who: 'hears', label: AI },
    { delay: 2200, op: 'reply',  kind: 'cta', tight: true,
      text: 'Our warehouse has already processed your order, and it’s now with the carrier. It should arrive in **3 to 5 business days**.',
      buttons: [ { label: 'Track my order' } ] }
  ] };
  /* =================================================================
     Campagnes WhatsApp : un seul message envoyé à la base (photo,
     texte, un bouton vers la page produit sur hears.com). La cliente
     passe commande (séparateur Shopify), puis remercie en un message.
     Faits et prix vérifiés sur hears.com le 2026-09-14 ; l'offre
     Black Friday est fictive mais reprend les mécaniques réelles de
     Hears (Buy 2 Get 1 Free + Carry Pouch offerte, liste VIP).
     ================================================================= */

  /* ===== 5. Campagne Black Friday (offre fictive) =================== */
  FLOWS['black-friday'] = { trigger: 'Campaign · Black Friday', steps: [
    { delay: 0,    op: 'typing', who: 'hears', label: 'Hears' },
    { delay: 2000, op: 'reply',  kind: 'card', auto: true,
      img: 'assets/campaign-bf-hero.jpg', w: 900, h: 450,
      cap: 'Hi Marie 🖤\n' +
           'Black Friday is here, and as a WhatsApp VIP you get in first.\n\n' +
           '**Buy 2, get 1 FREE** on all Hears, plus a **free Carry Pouch**: 3 pairs for **$86** instead of $129.',
      buttons: [ { label: 'Shop the Black Friday deal', href: 'https://hears.com/products/hears-earplugs' } ] },
    { delay: 1800, op: 'event',  kind: 'order', text: 'Order placed', amount: '$86' },   /* 3 × $43 = $129, 1 offerte */
    { delay: 1400, op: 'you',
      text: 'Thanks for the heads-up! I grabbed 3 pairs: one for me and two for Christmas gifts 🎁' }
  ] };

  /* ===== 6. Campagne partenariat Hears × Pacha ====================== */
  FLOWS['pacha'] = { trigger: 'Campaign · Hears × Pacha', steps: [
    { delay: 0,    op: 'typing', who: 'hears', label: 'Hears' },
    { delay: 2000, op: 'reply',  kind: 'card', auto: true,
      img: 'assets/campaign-pacha-hero.jpg', w: 1200, h: 600,
      cap: 'The cherries are back 🍒\n' +
           'Our **Pacha Ibiza Edition** returns for the 2026 season, stamped with Pacha’s iconic red cherries.\n\n' +
           'Made for the dance floor, and a **limited edition**.',
      buttons: [ { label: 'Discover the Pacha Edition', href: 'https://hears.com/products/pacha-2-0' } ] },
    { delay: 1800, op: 'event',  kind: 'order', text: 'Order placed', amount: '$92' },   /* 2 × $46 : au-dessus de $50, livraison offerte */
    { delay: 1400, op: 'you',
      text: 'Thanks for keeping me posted! I got two, one for me and one for my best friend. See you on the dance floor 🍒' }
  ] };

  /* ===== 7. Campagne lancement Hears Sleep ========================== */
  FLOWS['hears-sleep'] = { trigger: 'Campaign · Hears Sleep launch', steps: [
    { delay: 0,    op: 'typing', who: 'hears', label: 'Hears' },
    { delay: 2000, op: 'reply',  kind: 'card', auto: true,
      img: 'assets/campaign-sleep-hero.jpg', w: 1200, h: 600,
      cap: '✨ Just launched: **Hears Sleep**\n' +
           'The quietest earplugs we’ve ever made, designed for side sleepers. They block snoring, traffic and background noise.\n\n' +
           'Rated **4.9/5**, with **100 nights** to try them.',
      buttons: [ { label: 'Discover Hears Sleep', href: 'https://hears.com/products/hears-sleep' } ] },
    { delay: 1800, op: 'event',  kind: 'order', text: 'Order placed', amount: '$39' },
    { delay: 1400, op: 'you',
      text: 'Perfect timing, I’ve been sleeping so badly lately. Thanks for reaching out! 😴' }
  ] };


  /* ---------------------------------------------------------
     3. Easing spring (identique à Framer : k=400, c=30, m=1)
     --------------------------------------------------------- */
  function springLinear(stiffness, damping, mass, duration) {
    var w0 = Math.sqrt(stiffness / mass);
    var zeta = damping / (2 * Math.sqrt(stiffness * mass));
    var wd = w0 * Math.sqrt(Math.max(0, 1 - zeta * zeta));
    var n = 60, pts = [], i, t, y;
    for (i = 0; i <= n; i++) {
      t = duration * i / n;
      if (zeta < 1) {
        y = 1 - Math.exp(-zeta * w0 * t) * (Math.cos(wd * t) + (zeta * w0 / wd) * Math.sin(wd * t));
      } else {
        y = 1 - Math.exp(-w0 * t) * (1 + w0 * t);
      }
      pts.push(Math.round(y * 10000) / 10000);
    }
    return 'linear(' + pts.join(',') + ')';
  }

  try {
    if (window.CSS && CSS.supports && CSS.supports('transition-timing-function', 'linear(0, 1)')) {
      document.documentElement.style.setProperty('--spring', springLinear(400, 30, 1, 0.52));
    }
  } catch (e) { /* fallback cubic-bezier déjà défini en CSS */ }

  /* ---------------------------------------------------------
     4. Fabrique de noeuds
     --------------------------------------------------------- */
  function el(tag, cls, txt) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (txt != null) n.textContent = txt;
    return n;
  }

  /* Texte de message : **texte** devient du gras.
     On construit des noeuds texte (pas de innerHTML), les \n sont
     conservés grâce au white-space: pre-wrap. */
  function setRich(node, text) {
    String(text).split('**').forEach(function (part, i) {
      if (!part) return;
      if (i % 2) node.appendChild(el('strong', null, part));
      else node.appendChild(document.createTextNode(part));
    });
    return node;
  }

  function richP(cls, text) {
    return setRich(el('p', cls), text);
  }

  function icon(id) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    var use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', '#' + id);
    svg.appendChild(use);
    svg.setAttribute('viewBox', '0 0 20 20');
    return svg;
  }

  function makeButton(cfg) {
    var node = cfg.restart ? el('button', 'btn') : el('a', 'btn');
    if (!cfg.restart) node.href = cfg.href || '#';
    /* lien vers le vrai site : nouvel onglet, la démo continue */
    if (cfg.href && /^https?:/.test(cfg.href)) { node.target = '_blank'; node.rel = 'noopener'; }
    if (cfg.ghost) node.classList.add('btn--ghost');
    if (cfg.icon) node.appendChild(icon(cfg.icon));
    node.appendChild(el('span', null, cfg.label));
    if (cfg.restart) node.addEventListener('click', restart);
    return node;
  }

  /* accepte `buttons: [...]` ou `button: {...}` */
  function buttonsOf(step) {
    if (step.buttons) return step.buttons;
    return step.button ? [step.button] : [];
  }

  function buildContent(step) {
    var box, media, img;

    if (step.kind === 'card') {
      box = el('div', 'card' + (step.tall ? ' card--tall' : '') + (step.auto ? ' card--auto' : ''));
      media = el('div', 'card__media');
      img = el('img');
      img.src = step.img;
      img.alt = '';
      /* width/height : réserve la place avant le chargement, pas de saut de mise en page */
      if (step.w) { img.width = step.w; img.height = step.h; }
      media.appendChild(img);
      box.appendChild(media);
      if (step.cap) box.appendChild(richP('card__cap', step.cap));
      buttonsOf(step).forEach(function (cfg) { box.appendChild(makeButton(cfg)); });
      return box;
    }

    if (step.kind === 'panel') {
      box = el('div', 'panel');
      box.appendChild(richP('panel__text', step.text));
      return box;
    }

    if (step.kind === 'cta') {
      box = el('div', 'panel' + (step.tight ? ' panel--tight' : ''));
      box.appendChild(richP('panel__text', step.text));
      buttonsOf(step).forEach(function (cfg) { box.appendChild(makeButton(cfg)); });
      return box;
    }

    if (step.kind === 'form') {
      box = el('div', 'panel');
      box.appendChild(richP('panel__text', step.text));

      var form = el('form', 'cform');
      form.appendChild(field('input', 'text', 'Name'));
      form.appendChild(field('input', 'email', 'Email'));
      form.appendChild(field('textarea', null, 'Message'));
      var submit = el('button', 'cform__submit', 'Submit');
      submit.type = 'submit';
      form.appendChild(submit);
      form.addEventListener('submit', function (ev) { ev.preventDefault(); });
      box.appendChild(form);
      return box;
    }

    // bubble par défaut
    return setRich(el('div', 'bubble'), step.text);
  }

  function field(tag, type, placeholder) {
    var wrap = el('div', 'cform__field' + (tag === 'textarea' ? ' cform__field--area' : ''));
    var input = el(tag);
    if (type) input.type = type;
    input.placeholder = placeholder;
    wrap.appendChild(input);
    return wrap;
  }

  function typingNode() {
    var t = el('div', 'typing');
    t.appendChild(el('i'));
    t.appendChild(el('i'));
    t.appendChild(el('i'));
    return t;
  }

  /* ---------------------------------------------------------
     5. Moteur de conversation
     --------------------------------------------------------- */
  var chat = document.getElementById('chat');
  var timers = [];
  var current = null;   // { row, stack, label, typing }

  /* --- Suivi automatique du scroll -----------------------------------
     La page descend d'elle-même à chaque nouveau message. Dès que le
     visiteur remonte lui-même, on le laisse tranquille ; s'il redescend
     en bas, le suivi reprend. */
  var FOLLOW_MARGIN = 96;       // espace laissé sous le dernier message
  var following = true;
  var gesture = false, gestureTimer;
  var smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function markGesture() {
    gesture = true;
    clearTimeout(gestureTimer);
    gestureTimer = setTimeout(function () { gesture = false; }, 400);
  }
  ['wheel', 'touchmove'].forEach(function (ev) {
    window.addEventListener(ev, markGesture, { passive: true });
  });
  window.addEventListener('keydown', function (e) {
    if ([' ', 'PageUp', 'PageDown', 'Home', 'End', 'ArrowUp', 'ArrowDown'].indexOf(e.key) > -1) markGesture();
  });
  window.addEventListener('scroll', function () {
    if (!gesture) return;   // on n'arbitre que sur un vrai geste du visiteur
    var fromBottom = document.documentElement.scrollHeight - window.scrollY - window.innerHeight;
    following = fromBottom < 200;
  }, { passive: true });

  function follow(node) {
    if (!following || !node) return;
    var bottom = node.getBoundingClientRect().bottom + window.scrollY;
    var target = bottom - window.innerHeight + FOLLOW_MARGIN;
    if (target > window.scrollY + 1) {
      window.scrollTo({ top: target, behavior: smooth ? 'smooth' : 'auto' });
    }
  }

  function newRow(who) {
    var row = el('div', 'row');
    var av = el('div', 'avatar avatar--28');
    var img = el('img');
    img.src = AVATARS[who] || AVATARS.hears;
    img.alt = '';
    av.appendChild(img);
    var stack = el('div', 'row__stack');
    row.appendChild(av);
    row.appendChild(stack);
    chat.appendChild(row);
    return { row: row, stack: stack };
  }

  function play(step) {
    var node;

    if (step.op === 'typing') {
      current = newRow(step.who);
      if (step.label) {
        current.label = el('p', 'label' + (step.tightLabel ? ' label--tight' : ''), step.label);
        current.stack.appendChild(current.label);
      }
      current.typing = typingNode();
      current.stack.appendChild(current.typing);
      current.row.classList.add('enter');
      follow(current.row);
      return;
    }

    if (step.op === 'reply') {
      if (!current) return;
      if (current.typing) { current.typing.remove(); current.typing = null; }
      if (step.dropLabel && current.label) { current.label.remove(); current.label = null; }
      node = buildContent(step);
      node.classList.add('enter');
      current.stack.appendChild(node);
      follow(node);
      return;
    }

    if (step.op === 'add') {
      if (!current) return;
      node = buildContent(step);
      node.classList.add('enter');
      current.stack.appendChild(node);
      follow(node);
      return;
    }

    /* séparateur d'événement au milieu de la conversation */
    if (step.op === 'event') {
      node = el('div', 'datebar enter--fade');
      node.appendChild(el('span', 'datebar__line'));
      if (step.kind === 'order') {
        /* commande passée (automatisation ou campagne) : même séparateur que
           les autres, avec le logo Shopify devant le texte */
        var label = el('p', 'datebar__label datebar__label--order');
        var logo = el('img', 'datebar__logo');
        logo.src = 'assets/shopify-bag.webp';
        logo.alt = 'Shopify';
        label.appendChild(logo);
        label.appendChild(document.createTextNode(step.text + (step.amount ? ' · ' + step.amount : '')));
        node.appendChild(label);
      } else {
        node.appendChild(el('p', 'datebar__label', step.text));
      }
      node.appendChild(el('span', 'datebar__line'));
      chat.appendChild(node);
      follow(node);
      current = null;
      return;
    }

    if (step.op === 'you') {
      /* deux messages d'affilée du visiteur : on les empile sous le même
         nom, comme le fait WhatsApp, au lieu de répéter le libellé */
      var previous = chat.lastElementChild;
      if (previous && previous.classList.contains('row--me')) {
        node = setRich(el('div', 'bubble'), step.text);
        node.classList.add('enter');
        previous.querySelector('.row__stack').appendChild(node);
        follow(node);
        current = null;
        return;
      }

      var row = el('div', 'row row--me');
      var stack = el('div', 'row__stack');
      stack.appendChild(el('p', 'label', VISITOR));
      stack.appendChild(setRich(el('div', 'bubble'), step.text));
      row.appendChild(stack);
      row.classList.add('enter', 'enter--right');
      chat.appendChild(row);
      follow(row);
      current = null;
    }
  }

  var activeFlow = null;

  /* ---------------------------------------------------------
     Lecteur façon YouTube
     Les démos se jouent dans l'ordre de PLAYLIST puis on reboucle.
     À la fin d'une démo (dernier message + HOLD pour laisser lire),
     la suivante démarre. Le lecteur collé en haut affiche la démo
     en cours, permet pause / lecture et « suivant », et sa barre fine
     ne montre que la démo en cours : elle repart de zéro à chaque
     nouvelle démo (passage automatique ou « suivant »).
     --------------------------------------------------------- */
  var HOLD = 2500;   /* pause de lecture après le dernier message (ms) */

  var PLAYLIST = [
    /* une automatisation, une campagne, en alternance */
    { key: 'abandoned-cart',     group: 'Automation', name: 'Abandoned cart' },
    { key: 'black-friday',       group: 'Campaign',   name: 'Black Friday' },
    { key: 'order-confirmation', group: 'Automation', name: 'Order confirmation' },
    { key: 'pacha',              group: 'Campaign',   name: 'Hears × Pacha' },
    { key: 'ai-agent',           group: 'Automation', name: 'AI Agent' },
    { key: 'hears-sleep',        group: 'Campaign',   name: 'Hears Sleep launch' }
  ].filter(function (item) { return FLOWS[item.key]; });

  var ORDER = PLAYLIST.map(function (item) { return item.key; });

  /* --- liste des démos dans le lecteur : déjà jouées, en cours, à venir ;
         un clic lance la démo choisie ----------------------------------- */
  var playlistEl = document.getElementById('playlist');
  var playlistItems = [];
  var CHECK_SVG = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.4l2.9 2.9 6.1-6.6"/></svg>';
  if (playlistEl) {
    PLAYLIST.forEach(function (item, i) {
      var li = el('li');
      var btn = el('button', 'playlist__item');
      btn.type = 'button';
      var state = el('span', 'playlist__state');
      state.setAttribute('aria-hidden', 'true');
      state.appendChild(el('span', 'playlist__num', String(i + 1)));
      var check = el('span', 'playlist__check');
      check.innerHTML = CHECK_SVG;
      state.appendChild(check);
      var eq = el('span', 'playlist__eq');
      for (var b = 0; b < 3; b++) eq.appendChild(el('i'));
      state.appendChild(eq);
      btn.appendChild(state);
      btn.appendChild(el('span', 'playlist__name', item.name));
      btn.appendChild(el('span', 'playlist__group', item.group));
      btn.addEventListener('click', function () { loadFlow(item.key, true); });
      li.appendChild(btn);
      playlistEl.appendChild(li);
      playlistItems.push(btn);
    });
  }

  function paintPlaylist() {
    var idx = ORDER.indexOf(activeFlow);
    playlistItems.forEach(function (btn, i) {
      btn.classList.toggle('is-done', i < idx);
      btn.classList.toggle('is-current', i === idx);
      if (i === idx) btn.setAttribute('aria-current', 'true');
      else btn.removeAttribute('aria-current');
    });
    /* rangée de pastilles défilante (écrans étroits) : la démo en cours reste visible.
       Sans animation : un défilement doux ici serait annulé par celui de la page
       qui remonte en haut au même moment. */
    var cur = playlistItems[idx];
    if (cur && playlistEl.scrollWidth > playlistEl.clientWidth + 1) {
      playlistEl.scrollLeft = Math.max(0, cur.parentNode.offsetLeft - 16);
    }
  }

  /* instant (ms, vitesse appliquée) de chaque étape, et durée totale avec HOLD */
  function stepTimes(key) {
    var t = 0;
    return FLOWS[key].steps.map(function (step) { t += step.delay / SPEED; return t; });
  }
  function flowDuration(key) {
    var times = stepTimes(key);
    return (times.length ? times[times.length - 1] : 0) + HOLD;
  }

  /* --- barre de progression : une seule démo à la fois --------------- */
  var progressFill = document.getElementById('player-fill');

  /* --- lecture, pause, reprise ------------------------------------------
     Le temps écoulé dans la démo en cours est gelé pendant la pause ; à
     la reprise, seules les étapes pas encore jouées sont reprogrammées,
     avec le délai qu'il leur restait. */
  var playing = true;
  var flowStart = 0;   /* performance.now() du début de la démo, décalé des pauses */
  var pausedAt = 0;    /* temps écoulé figé pendant la pause */
  var played = 0;      /* nombre d'étapes déjà jouées dans la démo en cours */
  var progressRaf = 0;

  function elapsed() { return playing ? performance.now() - flowStart : pausedAt; }

  function schedule() {
    var now = elapsed();
    var steps = FLOWS[activeFlow].steps;
    var times = stepTimes(activeFlow);
    for (var i = played; i < steps.length; i++) {
      (function (i) {
        timers.push(setTimeout(function () { played = i + 1; play(steps[i]); }, Math.max(0, times[i] - now)));
      })(i);
    }
    if (ORDER.length > 1) timers.push(setTimeout(nextFlow, Math.max(0, flowDuration(activeFlow) - now)));
  }

  function clearTimers() {
    timers.forEach(clearTimeout);
    timers = [];
  }

  /* progression de la démo en cours selon le temps écoulé (recalculée à chaque
     image : reste juste après un passage en arrière-plan) ; repart de zéro à
     chaque nouvelle démo */
  function paintProgress() {
    var p = Math.min(1, elapsed() / flowDuration(activeFlow));
    if (progressFill) progressFill.style.width = (p * 100).toFixed(2) + '%';
    return p;
  }
  function tick() {
    var p = paintProgress();
    progressRaf = playing && p < 1 ? requestAnimationFrame(tick) : 0;
  }
  /* peint tout de suite (changement de démo visible sans attendre une frame), puis anime */
  function startTick() {
    cancelAnimationFrame(progressRaf);
    tick();
  }

  var toggleBtn = document.getElementById('player-toggle');
  function updateToggle() {
    if (!toggleBtn) return;
    toggleBtn.classList.toggle('is-paused', !playing);
    toggleBtn.setAttribute('aria-label', playing ? 'Pause' : 'Play');
    document.body.classList.toggle('is-paused', !playing);
  }

  function pause() {
    if (!playing) return;
    pausedAt = performance.now() - flowStart;
    playing = false;
    clearTimers();
    cancelAnimationFrame(progressRaf);
    paintProgress();
    updateToggle();
  }

  function resume() {
    if (playing) return;
    flowStart = performance.now() - pausedAt;
    playing = true;
    updateToggle();
    schedule();
    startTick();
  }

  function nextFlow() {
    loadFlow(ORDER[(ORDER.indexOf(activeFlow) + 1) % ORDER.length], true);
  }

  function run() {
    played = 0;
    pausedAt = 0;
    flowStart = performance.now();
    schedule();
    startTick();
  }

  /* toute (re)lecture d'une démo repart en mode lecture */
  function restart() {
    clearTimers();
    chat.innerHTML = '';
    current = null;
    following = true;
    playing = true;
    updateToggle();
    run();
  }

  /* Charge une démo : libellé du déclencheur, titre du lecteur, rejoue */
  function loadFlow(key, scroll) {
    if (!FLOWS[key]) key = DEFAULT_FLOW;
    activeFlow = key;

    var label = document.getElementById('trigger-label');
    if (label) label.textContent = FLOWS[key].trigger;

    var item = PLAYLIST[ORDER.indexOf(key)];
    var group = document.getElementById('player-group');
    var title = document.getElementById('player-title');
    if (item && group) group.textContent = item.group;
    if (item && title) title.textContent = item.name;
    paintPlaylist();

    if (scroll) window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
    restart();
  }

  if (toggleBtn) toggleBtn.addEventListener('click', function () { if (playing) pause(); else resume(); });
  var nextBtn = document.getElementById('player-next');
  if (nextBtn) nextBtn.addEventListener('click', nextFlow);

  /* ---------------------------------------------------------
     6. Nav sticky : visible quand on remonte
     --------------------------------------------------------- */
  (function stickyNav() {
    var nav = document.getElementById('navbar');
    if (!nav) return;
    var last = window.scrollY;
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        if (y > 160 && y < last - 2) nav.classList.add('is-visible');
        else if (y > last + 2 || y <= 160) nav.classList.remove('is-visible');
        last = y;
        ticking = false;
      });
    }, { passive: true });
  })();

  /* ---------------------------------------------------------
     7. Retour en haut
     --------------------------------------------------------- */
  (function toTop() {
    var btn = document.getElementById('totop');
    if (!btn) return;
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  })();

  /* ---------------------------------------------------------
     8. Preview vidéo au survol des mentions @brand
     --------------------------------------------------------- */
  (function brandPreview() {
    var box = document.getElementById('preview');
    var video = document.getElementById('preview-video');
    if (!box || !video) return;
    var hideTimer;

    document.querySelectorAll('.brand[data-preview]').forEach(function (link) {
      link.addEventListener('mouseenter', function () {
        clearTimeout(hideTimer);
        var src = link.getAttribute('data-preview');
        if (video.getAttribute('src') !== src) video.setAttribute('src', src);
        var r = link.getBoundingClientRect();
        var w = 342;
        var left = r.left + window.scrollX + r.width / 2 - w / 2;
        left = Math.max(8, Math.min(left, document.documentElement.clientWidth - w - 8));
        box.style.left = left + 'px';
        box.style.top = (r.bottom + window.scrollY) + 'px';
        box.classList.add('is-visible');
        var p = video.play();
        if (p && p.catch) p.catch(function () {});
      });
      link.addEventListener('mouseleave', function () {
        hideTimer = setTimeout(function () {
          box.classList.remove('is-visible');
          video.pause();
        }, 80);
      });
    });
  })();

  /* ---------------------------------------------------------
     9. Petite API de debug (console)
        KANAL.restart()      relance la conversation
        KANAL.isFollowing()  le scroll suit-il encore les messages ?
     --------------------------------------------------------- */
  window.KANAL = {
    restart: restart,
    load: function (key) { loadFlow(key, true); },
    current: function () { return activeFlow; },
    pause: pause,
    resume: resume,
    next: nextFlow,
    isPlaying: function () { return playing; },
    elapsed: function () { return Math.round(elapsed()); },
    isFollowing: function () { return following; }
  };

  /* ---------------------------------------------------------
     10. Routage entre les automatisations (#abandoned-cart…)
     --------------------------------------------------------- */
  /* seule une ancre d'automatisation connue charge une démo ; les boutons
     et liens factices (href="#") ne doivent pas relancer tout l'enchaînement */
  window.addEventListener('hashchange', function () {
    var key = location.hash.slice(1);
    if (FLOWS[key]) loadFlow(key, true);
  });
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href="#"]');
    if (a) e.preventDefault();
  });

  /* La démo démarre toujours par la première automatisation (panier
     abandonné), même si l'URL porte une ancre : sinon un rechargement
     reprendrait au milieu de l'enchaînement. */
  if (location.hash) history.replaceState(null, '', location.pathname + location.search);
  loadFlow(ORDER[0] || DEFAULT_FLOW, false);
})();
