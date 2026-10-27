/**
 * CLOUDSCAPE — Portfolio Client Interactions
 * Vanilla JavaScript (ES6+) for accessible navigation and interactions.
 * 
 * Features:
 * 1. Accessible Mobile Navigation Drawer (ARIA state, keyboard escape handling)
 * 2. Automatic menu closure on link navigation and viewport resizing
 * 3. Header elevation styling on page scroll
 * 4. Zero external dependencies - 100% static-ready for S3/CloudFront
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- Element Selectors ---
  const header = document.getElementById('site-header');
  const navToggle = document.getElementById('mobile-nav-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  // --- 1. Mobile Menu State Controller ---
  if (navToggle && mobileDrawer) {
    const toggleMenu = (open) => {
      const isOpen = open !== undefined ? open : navToggle.getAttribute('aria-expanded') === 'false';
      
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
      
      mobileDrawer.setAttribute('aria-hidden', String(!isOpen));
      
      if (isOpen) {
        mobileDrawer.classList.add('is-open');
        document.body.style.overflowY = 'hidden'; // Prevent background scrolling when menu is open
      } else {
        mobileDrawer.classList.remove('is-open');
        document.body.style.overflowY = '';
      }
    };

    // Toggle button click listener
    navToggle.addEventListener('click', () => {
      toggleMenu();
    });

    // Close menu when a navigation item is selected
    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        toggleMenu(false);
      });
    });

    // Keyboard accessibility: Close on Escape key
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
        toggleMenu(false);
        navToggle.focus(); // Return focus to toggle button for screen reader usability
      }
    });

    // Reset mobile menu if viewport resized to desktop dimensions
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navToggle.getAttribute('aria-expanded') === 'true') {
        toggleMenu(false);
      }
    });
  }

  // --- 2. Header Backdrop Elevation on Scroll ---
  const handleScroll = () => {
    if (!header) return;
    if (window.scrollY > 20) {
      header.style.backgroundColor = 'rgba(8, 13, 24, 0.95)';
      header.style.borderBottomColor = 'rgba(66, 217, 255, 0.2)';
    } else {
      header.style.backgroundColor = 'rgba(8, 13, 24, 0.85)';
      header.style.borderBottomColor = 'rgba(255, 255, 255, 0.07)';
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check on load

  // --- 3. Accessible Case Study Modal Dialog Controller ---
  const caseStudyButtons = document.querySelectorAll('.btn-case-study');
  const dialogCloseButtons = document.querySelectorAll('[data-dialog-close]');
  let lastActiveTrigger = null;

  // Open modal dialog
  caseStudyButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-dialog-target');
      const dialog = document.getElementById(targetId);
      if (dialog && typeof dialog.showModal === 'function') {
        lastActiveTrigger = btn;
        dialog.showModal();
        document.body.style.overflowY = 'hidden';
      }
    });
  });

  // Close modal dialog via close buttons
  dialogCloseButtons.forEach((closeBtn) => {
    closeBtn.addEventListener('click', () => {
      const dialog = closeBtn.closest('dialog');
      if (dialog) {
        dialog.close();
      }
    });
  });

  // Handle dialog close event, backdrop click, and focus restoration
  const caseStudyDialogs = document.querySelectorAll('.case-study-dialog');
  caseStudyDialogs.forEach((dialog) => {
    // Backdrop click detection
    dialog.addEventListener('click', (event) => {
      // If the click target is the dialog element itself (the backdrop), close it
      if (event.target === dialog) {
        dialog.close();
      }
    });

    // Cleanup on dialog close (native ESC, close() call, or backdrop click)
    dialog.addEventListener('close', () => {
      document.body.style.overflowY = '';
      if (lastActiveTrigger) {
        lastActiveTrigger.focus();
        lastActiveTrigger = null;
      }
    });
  });

  // ==========================================================================
  // --- 4. Interactive Cloud Architecture Lab Controller (Phase 3) ---
  // ==========================================================================
  const archNodes = document.querySelectorAll('.arch-node-btn');
  const inspectorName = document.getElementById('inspector-name');
  const inspectorCategory = document.getElementById('inspector-category');
  const inspectorPurpose = document.getElementById('inspector-purpose');
  const inspectorHappens = document.getElementById('inspector-happens');
  const inspectorSecurity = document.getElementById('inspector-security');
  const inspectorNext = document.getElementById('inspector-next');

  // Simulation Controls
  const btnRunSim = document.getElementById('btn-run-sim');
  const btnSimHit = document.getElementById('btn-sim-hit');
  const btnSimMiss = document.getElementById('btn-sim-miss');
  const btnResetSim = document.getElementById('btn-reset-sim');
  const simStatusText = document.getElementById('sim-status-text');
  const simBeacon = document.getElementById('sim-beacon');
  const simLogFeed = document.getElementById('sim-log-feed');
  const simClock = document.getElementById('sim-clock');

  // Architecture Component Accurate Knowledge Base
  const componentData = {
    browser: {
      name: "User's Browser (Client Endpoint)",
      category: "STAGE 01 • INITIATION",
      purpose: "Initiates an HTTPS request for a static resource such as index.html, CSS, JavaScript, or an image.",
      happens: "The visitor navigates to the portfolio URL. The browser resolves CloudFront Anycast IP addresses via DNS, establishes a TCP three-way handshake, negotiates TLS 1.3 parameters, and emits an HTTP GET request with standard client headers (e.g., User-Agent, Accept, Accept-Encoding, If-None-Match).",
      security: "Modern browsers enforce HTTP Strict Transport Security (HSTS), Content Security Policy (CSP), and Cross-Origin Resource Sharing (CORS). Origin credentials or AWS IAM secrets are never exposed to the client.",
      next: "An encrypted TLS byte stream encapsulating the HTTP GET request directed at port 443 of the nearest CloudFront Point of Presence (PoP)."
    },
    tls: {
      name: "HTTPS / TLS 1.3 (Transport Security)",
      category: "STAGE 02 • ENCRYPTION",
      purpose: "Encrypts traffic between the client and the CloudFront endpoint and helps authenticate the endpoint using its certificate.",
      happens: "Negotiates cryptographic cipher suites using ECDHE key exchange and AES-GCM or ChaCha20-Poly1305 encryption. Validates the ACM (AWS Certificate Manager) X.509 certificate to guarantee domain authenticity and prevent eavesdropping or packet tampering.",
      security: "Enforces modern TLS protocols (TLS 1.2 minimum, TLS 1.3 preferred), perfect forward secrecy (PFS), SNI (Server Name Indication), and automatic redirection from HTTP port 80 to HTTPS port 443.",
      next: "Authenticated and decrypted HTTP/2 or HTTP/3 request streams arriving at the nearest CloudFront Point of Presence (PoP)."
    },
    cloudfront: {
      name: "Amazon CloudFront (Global CDN Edge)",
      category: "STAGE 03 • EDGE CACHE",
      purpose: "Acts as the content delivery network. It can serve cached content from an edge location or retrieve content from the configured origin when needed.",
      happens: "The edge location inspects the request URI and checks edge memory and SSD caches. On a cache hit, CloudFront serves the cached asset immediately with low latency (X-Cache: Hit from cloudfront). On a cache miss, CloudFront signs the request via Origin Access Control (OAC) and forwards it to the configured S3 REST origin.",
      security: "Protects origins from direct volumetric DDoS attacks with AWS Shield Standard, terminates untrusted traffic at AWS edge boundaries, and conceals the private S3 bucket URI and ARN from the public internet.",
      next: "When a cache miss occurs, the private S3 origin receives an authenticated REST request signed with CloudFront Origin Access Control (SigV4) credentials."
    },
    s3: {
      name: "Private Amazon S3 Origin (Protected Storage)",
      category: "STAGE 04 • REST ORIGIN",
      purpose: "Stores the static website assets. For this architecture, use a regular S3 bucket origin with CloudFront Origin Access Control (OAC), bucket Block Public Access enabled, and a bucket policy that permits access through the intended CloudFront distribution.\n\nImportant technical distinction: Do not use an S3 website endpoint as the private OAC origin. Use the regular S3 REST origin for this architecture.",
      happens: "S3 receives the SigV4-signed REST request from CloudFront, validates the cryptographic signature against the bucket policy, confirms the caller is the specific CloudFront distribution ARN, reads the object key, and streams the binary/text payload back to CloudFront over private AWS network links.",
      security: "All four S3 'Block Public Access' settings remain strictly enabled. The bucket policy employs least-privilege principles allowing s3:GetObject only to cloudfront.amazonaws.com with condition aws:SourceArn matching the distribution. Direct public access is completely blocked.",
      next: "S3 returns the requested file payload, MIME Content-Type, and ETag to CloudFront for edge caching and client delivery."
    }
  };

  // 1. Select and inspect component
  function selectComponent(key, focusElement = false) {
    const data = componentData[key];
    if (!data) return;

    // Update buttons state
    archNodes.forEach((node) => {
      const isMatch = node.getAttribute('data-component') === key;
      node.classList.toggle('is-selected', isMatch);
      node.setAttribute('aria-selected', String(isMatch));
      node.setAttribute('tabindex', isMatch ? '0' : '-1');
      if (isMatch && focusElement) {
        node.focus();
      }
    });

    // Update Inspector content
    if (inspectorName) inspectorName.textContent = data.name;
    if (inspectorCategory) inspectorCategory.textContent = data.category;
    if (inspectorPurpose) inspectorPurpose.textContent = data.purpose;
    if (inspectorHappens) inspectorHappens.textContent = data.happens;
    if (inspectorSecurity) inspectorSecurity.textContent = data.security;
    if (inspectorNext) inspectorNext.textContent = data.next;
  }

  // Node Click Listeners & Keyboard Roving Tab Navigation
  archNodes.forEach((node, index) => {
    node.addEventListener('click', () => {
      const compKey = node.getAttribute('data-component');
      selectComponent(compKey);
    });

    node.addEventListener('keydown', (e) => {
      let targetIndex = -1;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        targetIndex = (index + 1) % archNodes.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        targetIndex = (index - 1 + archNodes.length) % archNodes.length;
      }

      if (targetIndex !== -1) {
        e.preventDefault();
        const nextComp = archNodes[targetIndex].getAttribute('data-component');
        selectComponent(nextComp, true);
      }
    });
  });

  // 2. Simulation State & Helpers
  let isSimulating = false;
  let activeTimeouts = [];

  const getSimTimestamp = () => {
    const now = new Date();
    return `[${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}]`;
  };

  const addLog = (tag, tagClass, message) => {
    if (!simLogFeed) return;
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.innerHTML = `<span class="log-ts">${getSimTimestamp()}</span> <span class="log-tag ${tagClass}">${tag}</span> <span class="log-msg">${message}</span>`;
    simLogFeed.appendChild(entry);
    simLogFeed.scrollTop = simLogFeed.scrollHeight;
  };

  const clearHighlight = () => {
    archNodes.forEach((n) => n.classList.remove('sim-active'));
    document.querySelectorAll('.arch-connector').forEach((c) => c.classList.remove('sim-highlight'));
  };

  const setControlsDisabled = (disabled) => {
    if (btnRunSim) btnRunSim.disabled = disabled;
    if (btnSimHit) btnSimHit.disabled = disabled;
    if (btnSimMiss) btnSimMiss.disabled = disabled;
  };

  const resetSimulation = () => {
    isSimulating = false;
    activeTimeouts.forEach((t) => clearTimeout(t));
    activeTimeouts = [];
    clearHighlight();
    setControlsDisabled(false);

    if (simStatusText) simStatusText.textContent = 'STATUS: READY';
    if (simBeacon) {
      simBeacon.style.backgroundColor = 'var(--color-electric-cyan)';
      simBeacon.style.boxShadow = '0 0 6px var(--color-electric-cyan)';
    }

    if (simLogFeed) {
      simLogFeed.innerHTML = `
        <div class="log-entry log-system">
          <span class="log-ts">${getSimTimestamp()}</span>
          <span class="log-tag tag-sys">READY</span>
          <span class="log-msg">Simulator reset. Select an action above to trigger an educational packet traversal.</span>
        </div>`;
    }
    selectComponent('browser');
  };

  if (btnResetSim) {
    btnResetSim.addEventListener('click', resetSimulation);
  }

  // 3. Simulation Runner
  function runSimulation(mode = 'standard') {
    if (isSimulating) return;
    isSimulating = true;
    setControlsDisabled(true);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const stepDelay = prefersReducedMotion ? 150 : 850;

    clearHighlight();
    if (simStatusText) simStatusText.textContent = `STATUS: SIMULATING (${mode.toUpperCase()})`;
    if (simBeacon) {
      simBeacon.style.backgroundColor = '#F59E0B';
      simBeacon.style.boxShadow = '0 0 8px #F59E0B';
    }

    const nodeBrowser = document.getElementById('node-browser');
    const nodeTls = document.getElementById('node-tls');
    const nodeCloudfront = document.getElementById('node-cloudfront');
    const nodeS3 = document.getElementById('node-s3');

    const conn1 = document.getElementById('connector-1');
    const conn2 = document.getElementById('connector-2');
    const conn3 = document.getElementById('connector-3');

    // Define Pipeline Steps based on Mode
    let steps = [];

    if (mode === 'hit') {
      // CACHE HIT: Browser -> TLS -> CloudFront (Hit & Return directly to Browser)
      steps = [
        {
          delay: 0,
          action: () => {
            selectComponent('browser');
            if (nodeBrowser) nodeBrowser.classList.add('sim-active');
            addLog('CLIENT', 'tag-step', 'Browser issues HTTP GET /index.html (Accept: text/html, gzip, br).');
          }
        },
        {
          delay: stepDelay,
          action: () => {
            clearHighlight();
            if (conn1) conn1.classList.add('sim-highlight');
            if (nodeTls) nodeTls.classList.add('sim-active');
            selectComponent('tls');
            addLog('TLS', 'tag-step', 'TLS 1.3 handshake established on port 443 with ACM edge certificate.');
          }
        },
        {
          delay: stepDelay * 2,
          action: () => {
            clearHighlight();
            if (conn2) conn2.classList.add('sim-highlight');
            if (nodeCloudfront) nodeCloudfront.classList.add('sim-active');
            selectComponent('cloudfront');
            addLog('CACHE', 'tag-hit', 'EDGE HIT: Valid cached object found in edge memory (X-Cache: Hit from cloudfront).');
            addLog('CACHE', 'tag-hit', 'Response generated directly at edge PoP. Zero origin egress requested.');
          }
        },
        {
          delay: stepDelay * 3,
          action: () => {
            clearHighlight();
            if (nodeBrowser) nodeBrowser.classList.add('sim-active');
            selectComponent('browser');
            addLog('SUCCESS', 'tag-ok', 'Browser receives 200 OK from CloudFront edge cache. Round-trip complete.');
            finishSimulation('COMPLETE: CACHE HIT (EDGE)');
          }
        }
      ];
    } else {
      // CACHE MISS or STANDARD SIMULATION: Browser -> TLS -> CloudFront -> S3 -> CloudFront -> Browser
      steps = [
        {
          delay: 0,
          action: () => {
            selectComponent('browser');
            if (nodeBrowser) nodeBrowser.classList.add('sim-active');
            addLog('CLIENT', 'tag-step', 'Browser issues HTTP GET /index.html (Origin: client).');
          }
        },
        {
          delay: stepDelay,
          action: () => {
            clearHighlight();
            if (conn1) conn1.classList.add('sim-highlight');
            if (nodeTls) nodeTls.classList.add('sim-active');
            selectComponent('tls');
            addLog('TLS', 'tag-step', 'Encrypted TLS 1.3 session negotiated with CloudFront Anycast edge.');
          }
        },
        {
          delay: stepDelay * 2,
          action: () => {
            clearHighlight();
            if (conn2) conn2.classList.add('sim-highlight');
            if (nodeCloudfront) nodeCloudfront.classList.add('sim-active');
            selectComponent('cloudfront');
            if (mode === 'miss') {
              addLog('CACHE', 'tag-miss', 'EDGE MISS: Object not present in edge cache (X-Cache: Miss from cloudfront).');
            } else {
              addLog('EDGE', 'tag-step', 'CloudFront evaluates request, applies AWS SigV4 signature via OAC.');
            }
          }
        },
        {
          delay: stepDelay * 3,
          action: () => {
            clearHighlight();
            if (conn3) conn3.classList.add('sim-highlight');
            if (nodeS3) nodeS3.classList.add('sim-active');
            selectComponent('s3');
            addLog('ORIGIN', 'tag-step', 'Private S3 REST origin verifies SigV4 header against bucket policy.');
            addLog('ORIGIN', 'tag-step', 'Bucket policy condition aws:SourceArn matches CloudFront distribution. Serving /index.html.');
          }
        },
        {
          delay: stepDelay * 4,
          action: () => {
            clearHighlight();
            if (conn3) conn3.classList.add('sim-highlight');
            if (nodeCloudfront) nodeCloudfront.classList.add('sim-active');
            selectComponent('cloudfront');
            addLog('CACHE', 'tag-step', 'CloudFront caches asset per Cache-Control header and streams payload to client.');
          }
        },
        {
          delay: stepDelay * 5,
          action: () => {
            clearHighlight();
            if (nodeBrowser) nodeBrowser.classList.add('sim-active');
            selectComponent('browser');
            addLog('SUCCESS', 'tag-ok', 'Browser renders verified static payload (200 OK). Request lifecycle complete.');
            finishSimulation(mode === 'miss' ? 'COMPLETE: CACHE MISS (ORIGIN FETCH)' : 'COMPLETE: PIPELINE SIMULATION');
          }
        }
      ];
    }

    // Schedule steps
    steps.forEach((step) => {
      const tid = setTimeout(step.action, step.delay);
      activeTimeouts.push(tid);
    });
  }

  function finishSimulation(finalStatus) {
    isSimulating = false;
    setControlsDisabled(false);
    if (simStatusText) simStatusText.textContent = `STATUS: ${finalStatus}`;
    if (simBeacon) {
      simBeacon.style.backgroundColor = '#10B981';
      simBeacon.style.boxShadow = '0 0 8px #10B981';
    }
  }

  // Attach button triggers
  if (btnRunSim) {
    btnRunSim.addEventListener('click', () => runSimulation('standard'));
  }
  if (btnSimHit) {
    btnSimHit.addEventListener('click', () => runSimulation('hit'));
  }
  if (btnSimMiss) {
    btnSimMiss.addEventListener('click', () => runSimulation('miss'));
  }

  /* ==========================================================================
     PHASE 4: CLOUD DELIVERY SIMULATOR CONTROLLER
     Simplified Deterministic Educational Model for Static Content Delivery
     ========================================================================== */
  function initCloudDeliverySimulator() {
    const simSection = document.getElementById('simulator');
    if (!simSection) return;

    // --- Deterministic Model Constants ---
    const THROUGHPUT_KBPS = 20000; // 20 Mbps effective throughput
    const EDGE_OVERHEAD_MS = 5;    // 5 ms Edge processing overhead
    const ORIGIN_OVERHEAD_MS = 25; // 25 ms Origin processing overhead
    const DEFAULT_LATENCY = 80;    // 80 ms default round-trip latency
    const DEFAULT_CACHE_PROB = 80; // 80% default cache-hit probability
    const DEFAULT_ASSET_SIZE = 500;// 500 KB default asset size

    // --- Element Selectors ---
    const inputLatency = document.getElementById('input-latency');
    const valLatency = document.getElementById('val-latency');
    const inputCacheProb = document.getElementById('input-cache-prob');
    const valCacheProb = document.getElementById('val-cache-prob');
    const assetRadios = document.querySelectorAll('input[name="asset-size"]');
    const valAssetSize = document.getElementById('val-asset-size');

    const btnRunDeliverySim = document.getElementById('btn-run-delivery-sim');
    const btnResetDeliverySim = document.getElementById('btn-reset-delivery-sim');

    const timeEdgeHit = document.getElementById('time-edge-hit');
    const breakdownEdgeHit = document.getElementById('breakdown-edge-hit');
    const timeOriginFetch = document.getElementById('time-origin-fetch');
    const breakdownOriginFetch = document.getElementById('breakdown-origin-fetch');
    const timeMixedDelivery = document.getElementById('time-mixed-delivery');
    const breakdownMixed = document.getElementById('breakdown-mixed');
    const mixedWeightFlag = document.getElementById('mixed-weight-flag');

    const barEdgeHit = document.getElementById('bar-edge-hit');
    const chartMsEdge = document.getElementById('chart-ms-edge');
    const barMixed = document.getElementById('bar-mixed');
    const chartMsMixed = document.getElementById('chart-ms-mixed');
    const barOrigin = document.getElementById('bar-origin');
    const chartMsOrigin = document.getElementById('chart-ms-origin');

    const deliveryLogFeed = document.getElementById('delivery-log-feed');
    const deliveryClock = document.getElementById('delivery-clock');
    const insightsGrid = document.getElementById('insights-grid');

    // Helper: format asset size label
    function formatSizeLabel(sizeInKB) {
      if (sizeInKB >= 1000) {
        const mb = sizeInKB / 1000;
        return Number.isInteger(mb) ? `${mb} MB` : `${mb.toFixed(1)} MB`;
      }
      return `${sizeInKB} KB`;
    }

    // Helper: get selected asset size value
    function getSelectedAssetSize() {
      for (const radio of assetRadios) {
        if (radio.checked) {
          return parseInt(radio.value, 10);
        }
      }
      return DEFAULT_ASSET_SIZE;
    }

    // Helper: get timestamp
    function getTimestampString() {
      const now = new Date();
      return `[${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}]`;
    }

    // Helper: add log entry
    function appendDeliveryLog(tag, tagClass, message) {
      if (!deliveryLogFeed) return;
      const entry = document.createElement('div');
      entry.className = 'log-entry';
      entry.innerHTML = `<span class="log-ts">${getTimestampString()}</span> <span class="log-tag ${tagClass}">${tag}</span> <span class="log-msg">${message}</span>`;
      deliveryLogFeed.appendChild(entry);
      deliveryLogFeed.scrollTop = deliveryLogFeed.scrollHeight;
    }

    // --- Deterministic Mathematical Calculations ---
    function computeTransferTime(sizeInKB) {
      // asset size in kilobits divided by 20,000 kilobits per second, converted to milliseconds
      const sizeInKilobits = sizeInKB * 8;
      return (sizeInKilobits / THROUGHPUT_KBPS) * 1000; // equivalent to sizeInKB * 0.4
    }

    function computeEdgeEstimate(latency, sizeInKB) {
      // Edge-cache delivery estimate = network latency + edge processing overhead + transfer time
      const transferTime = computeTransferTime(sizeInKB);
      return latency + EDGE_OVERHEAD_MS + transferTime;
    }

    function computeOriginEstimate(latency, sizeInKB) {
      // Origin-fetch delivery estimate = network latency * 2 + origin processing overhead + transfer time
      const transferTime = computeTransferTime(sizeInKB);
      return (latency * 2) + ORIGIN_OVERHEAD_MS + transferTime;
    }

    function computeMixedEstimate(edgeEst, originEst, hitProbPercent) {
      // Probability-weighted estimate: cache-hit probability * edge estimate + cache-miss probability * origin estimate
      const hitProb = hitProbPercent / 100;
      const missProb = 1 - hitProb;
      return (hitProb * edgeEst) + (missProb * originEst);
    }

    // --- Dynamic Insights Generator ---
    function renderEngineeringInsights(latency, hitProb, assetSize, transferTime, edgeEst, originEst, mixedEst) {
      if (!insightsGrid) return;

      // 1. Cache-hit probability insight
      let hitInsightText = '';
      if (hitProb >= 80) {
        hitInsightText = `High assumed cache-hit probability (${hitProb}%) strongly anchors expected delivery (${Math.round(mixedEst)} ms) near the edge scenario (${Math.round(edgeEst)} ms), significantly reducing origin traversals across aggregate requests.`;
      } else if (hitProb >= 40) {
        hitInsightText = `Moderate cache-hit probability (${hitProb}%) splits traffic. Even partial origin fetches (${Math.round(originEst)} ms) meaningfully elevate the aggregate weighted duration (${Math.round(mixedEst)} ms) above pure edge baseline.`;
      } else {
        hitInsightText = `Low cache-hit probability (${hitProb}%) means the majority of requests incur the full origin round-trip penalty (2× RTT + origin overhead). Expected delivery (${Math.round(mixedEst)} ms) approaches the origin baseline (${Math.round(originEst)} ms).`;
      }

      // 2. Asset size insight
      let sizeInsightText = '';
      if (assetSize <= 100) {
        sizeInsightText = `At 100 KB, transfer duration is brief (${Math.round(transferTime)} ms at 20 Mbps). Under these conditions, network round-trip latency (${latency} ms) and processing overheads account for the largest proportion of total delivery time.`;
      } else if (assetSize <= 500) {
        sizeInsightText = `At 500 KB, transfer duration (${Math.round(transferTime)} ms at 20 Mbps) represents roughly 70% of edge delivery latency. Payload scale affects edge and origin transfer durations identically.`;
      } else if (assetSize <= 1000) {
        sizeInsightText = `At 1 MB (1,000 KB), transfer time reaches ${Math.round(transferTime)} ms at 20 Mbps, surpassing network RTT and demonstrating why compression and asset minification remain essential even with global CDN distribution.`;
      } else {
        sizeInsightText = `At 5 MB, transfer time expands to ${Math.round(transferTime)} ms at 20 Mbps, dominating total delivery (${Math.round(edgeEst)} ms edge / ${Math.round(originEst)} ms origin). Large payloads illustrate the architectural need for chunking or range-request caching.`;
      }

      // 3. Network Latency sensitivity
      const latencyInsightText = `Network latency (${latency} ms) is amplified twofold on origin fetches (${latency * 2} ms) because the delivery path must bridge client-to-edge and edge-to-origin hops, whereas edge hits eliminate the second hop entirely.`;

      // 4. Origin isolation
      const originIsolationText = `A cache hit avoids an origin fetch for the requested object. The CloudFront edge location terminates the request and serves valid cached content directly, shielding the protected S3 origin from request traffic.`;

      insightsGrid.innerHTML = `
        <div class="insight-item">
          <div class="insight-item-header">
            <h4 class="insight-item-title">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="8" cy="8" r="6" stroke="#42D9FF" stroke-width="1.4"/>
                <path d="M5 8L7 10L11 6" stroke="#42D9FF" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>Cache-Hit Probability Shift</span>
            </h4>
            <span class="insight-tag">${hitProb}% Assumed</span>
          </div>
          <p class="insight-item-text">${hitInsightText}</p>
        </div>

        <div class="insight-item">
          <div class="insight-item-header">
            <h4 class="insight-item-title">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <rect x="3" y="3" width="10" height="10" rx="2" stroke="#9275FF" stroke-width="1.4"/>
                <path d="M3 7H13" stroke="#9275FF" stroke-width="1.2"/>
              </svg>
              <span>Payload Transfer Scaling</span>
            </h4>
            <span class="insight-tag">${formatSizeLabel(assetSize)}</span>
          </div>
          <p class="insight-item-text">${sizeInsightText}</p>
        </div>

        <div class="insight-item">
          <div class="insight-item-header">
            <h4 class="insight-item-title">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="8" cy="8" r="6" stroke="#42D9FF" stroke-width="1.4"/>
                <path d="M8 4V8L11 9.5" stroke="#42D9FF" stroke-width="1.4" stroke-linecap="round"/>
              </svg>
              <span>Round-Trip Latency Impact</span>
            </h4>
            <span class="insight-tag">${latency} ms RTT</span>
          </div>
          <p class="insight-item-text">${latencyInsightText}</p>
        </div>

        <div class="insight-item">
          <div class="insight-item-header">
            <h4 class="insight-item-title">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 2L13 4.5V8.5C13 11.5 8 14 8 14C8 14 3 11.5 3 8.5V4.5L8 2Z" stroke="#9275FF" stroke-width="1.4"/>
              </svg>
              <span>Origin Fetch Avoidance</span>
            </h4>
            <span class="insight-tag">S3 Protected</span>
          </div>
          <p class="insight-item-text">${originIsolationText}</p>
        </div>
      `;
    }

    // --- Update Controller ---
    function updateCalculations() {
      const latency = parseInt(inputLatency ? inputLatency.value : DEFAULT_LATENCY, 10);
      const hitProb = parseInt(inputCacheProb ? inputCacheProb.value : DEFAULT_CACHE_PROB, 10);
      const assetSize = getSelectedAssetSize();
      const missProb = 100 - hitProb;

      // Update control display badges
      if (valLatency) valLatency.textContent = `${latency} ms`;
      if (valCacheProb) valCacheProb.textContent = `${hitProb}%`;
      if (valAssetSize) valAssetSize.textContent = formatSizeLabel(assetSize);

      // Compute values
      const transferTime = computeTransferTime(assetSize);
      const edgeEst = computeEdgeEstimate(latency, assetSize);
      const originEst = computeOriginEstimate(latency, assetSize);
      const mixedEst = computeMixedEstimate(edgeEst, originEst, hitProb);

      // Rounded integers for display
      const edgeRound = Math.round(edgeEst);
      const originRound = Math.round(originEst);
      const mixedRound = Math.round(mixedEst);
      const transferRound = Math.round(transferTime);

      // Update Result Panels
      if (timeEdgeHit) timeEdgeHit.textContent = edgeRound;
      if (breakdownEdgeHit) {
        breakdownEdgeHit.innerHTML = `<code>${latency}ms RTT + 5ms Edge + ${transferRound}ms Transfer</code>`;
      }

      if (timeOriginFetch) timeOriginFetch.textContent = originRound;
      if (breakdownOriginFetch) {
        breakdownOriginFetch.innerHTML = `<code>${latency * 2}ms (2&times;RTT) + 25ms Origin + ${transferRound}ms Transfer</code>`;
      }

      if (timeMixedDelivery) timeMixedDelivery.textContent = mixedRound;
      if (breakdownMixed) {
        const hitWeight = (hitProb / 100).toFixed(2);
        const missWeight = (missProb / 100).toFixed(2);
        breakdownMixed.innerHTML = `<code>(${hitWeight} &times; ${edgeRound}ms) + (${missWeight} &times; ${originRound}ms)</code>`;
      }
      if (mixedWeightFlag) {
        mixedWeightFlag.textContent = `${hitProb}% Edge • ${missProb}% Origin`;
      }

      // Update Visual Comparison Chart Bars
      // Origin estimate serves as the 100% baseline scale
      if (barOrigin && chartMsOrigin) {
        barOrigin.style.width = '100%';
        chartMsOrigin.textContent = `${originRound} ms`;
      }

      if (barEdgeHit && chartMsEdge) {
        const edgeRatio = originEst > 0 ? (edgeEst / originEst) * 100 : 0;
        const clampedEdge = Math.min(100, Math.max(8, edgeRatio));
        barEdgeHit.style.width = `${clampedEdge.toFixed(1)}%`;
        chartMsEdge.textContent = `${edgeRound} ms`;
      }

      if (barMixed && chartMsMixed) {
        const mixedRatio = originEst > 0 ? (mixedEst / originEst) * 100 : 0;
        const clampedMixed = Math.min(100, Math.max(8, mixedRatio));
        barMixed.style.width = `${clampedMixed.toFixed(1)}%`;
        chartMsMixed.textContent = `${mixedRound} ms`;
      }

      // Update Dynamic Insights
      renderEngineeringInsights(latency, hitProb, assetSize, transferTime, edgeEst, originEst, mixedEst);
    }

    // --- Simulation Run Action (Event Log Generator) ---
    function runDeliverySimulation() {
      const latency = parseInt(inputLatency ? inputLatency.value : DEFAULT_LATENCY, 10);
      const hitProb = parseInt(inputCacheProb ? inputCacheProb.value : DEFAULT_CACHE_PROB, 10);
      const assetSize = getSelectedAssetSize();
      const missProb = 100 - hitProb;

      const transferTime = computeTransferTime(assetSize);
      const edgeEst = computeEdgeEstimate(latency, assetSize);
      const originEst = computeOriginEstimate(latency, assetSize);
      const mixedEst = computeMixedEstimate(edgeEst, originEst, hitProb);

      const edgeRound = Math.round(edgeEst);
      const originRound = Math.round(originEst);
      const mixedRound = Math.round(mixedEst);
      const transferRound = Math.round(transferTime);

      // Update clock
      if (deliveryClock) deliveryClock.textContent = getTimestampString();

      // Clear previous run and append event trace
      if (deliveryLogFeed) {
        deliveryLogFeed.innerHTML = '';
      }

      appendDeliveryLog('INPUT', 'tag-step', `Inputs accepted: RTT Latency = ${latency}ms, Cache-Hit Probability = ${hitProb}%, Asset Size = ${formatSizeLabel(assetSize)} (${assetSize * 8} kbit at 20 Mbps &rarr; ${transferRound}ms transfer).`);
      
      appendDeliveryLog('PARAM', 'tag-sys', `Assumed cache-hit probability: ${hitProb}% (cache-miss probability: ${missProb}%). Note: Cache-hit probability is a user-defined simulation parameter, not an observed AWS metric.`);
      
      appendDeliveryLog('EDGE', 'tag-hit', `Edge cache hit estimate calculated: ${latency}ms RTT + 5ms Edge overhead + ${transferRound}ms transfer = ${edgeRound}ms. (Zero S3 origin fetch required).`);
      
      appendDeliveryLog('ORIGIN', 'tag-miss', `Origin fetch estimate calculated: ${latency * 2}ms (2&times;RTT) + 25ms S3 overhead + ${transferRound}ms transfer = ${originRound}ms. (Origin request required).`);
      
      appendDeliveryLog('WEIGHTED', 'tag-ok', `Probability-weighted mixed delivery estimate produced: (${(hitProb / 100).toFixed(2)} &times; ${edgeRound}ms) + (${(missProb / 100).toFixed(2)} &times; ${originRound}ms) = ${mixedRound}ms illustrative estimate.`);
    }

    // --- Reset Action ---
    function resetDeliveryDefaults() {
      if (inputLatency) inputLatency.value = DEFAULT_LATENCY;
      if (inputCacheProb) inputCacheProb.value = DEFAULT_CACHE_PROB;
      
      assetRadios.forEach((radio) => {
        radio.checked = parseInt(radio.value, 10) === DEFAULT_ASSET_SIZE;
      });

      updateCalculations();

      if (deliveryClock) deliveryClock.textContent = 'LOCAL RUNTIME';
      if (deliveryLogFeed) {
        deliveryLogFeed.innerHTML = `
          <div class="log-entry log-system">
            <span class="log-ts">[00:00:00]</span>
            <span class="log-tag tag-sys">READY</span>
            <span class="log-msg">Simulator reset to reference defaults (80ms RTT, 80% Cache-Hit, 500 KB). Click "Run delivery simulation" to trace calculation steps.</span>
          </div>`;
      }
    }

    // --- Attach Event Listeners ---
    if (inputLatency) {
      inputLatency.addEventListener('input', updateCalculations);
    }

    if (inputCacheProb) {
      inputCacheProb.addEventListener('input', updateCalculations);
    }

    assetRadios.forEach((radio) => {
      radio.addEventListener('change', updateCalculations);
    });

    if (btnRunDeliverySim) {
      btnRunDeliverySim.addEventListener('click', runDeliverySimulation);
    }

    if (btnResetDeliverySim) {
      btnResetDeliverySim.addEventListener('click', resetDeliveryDefaults);
    }

    // Initial calculation run
    updateCalculations();
  }

  // Initialize Cloud Delivery Simulator
  initCloudDeliverySimulator();

  // ==========================================================================
  // --- 6. Dynamic Footer Year Controller (Phase 5) ---
  // ==========================================================================
  const currentYearEl = document.getElementById('current-year');
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }
});
