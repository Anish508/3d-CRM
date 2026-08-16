/* ==========================================================================
   SCALEVYN INVOICE, QUOTATION & RECEIPT APPLICATION LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    docType: 'invoice', // 'invoice' | 'quotation' | 'receipt'
    currency: '₹',
    docNumber: 'INV-20260707-731',
    docStatus: 'SENT',
    issueDate: '2026-07-07',
    dueDate: '2026-07-21',
    advancePaid: 0,
    
    // Optional Controls
    enableTaxesSection: false,
    enableGst: false,
    enableNotesSection: true,
    bankAccountType: 'business',

    // Receipt Data
    receipt: {
      paymentMode: 'UPI / GPay / PhonePe',
      transactionId: 'REC-20260726-710',
      amountPaid: 2150,
      paymentDate: '2026-07-26'
    },

    // Client Info
    client: {
      name: 'Priya',
      businessName: 'PRIME TECH Equipments Repairing L.L.C',
      phone: '+91 55 303 3714',
      email: 'smitha@primemea.com',
      address: 'Al-Quoz Ind-2, Dubai, U.A.E.'
    },

    // Company Info
    company: {
      name: '3DHeritage',
      domain: '3dheritage.com',
      address: '102 Heritage Creative Studio, Craft Sector',
      cityStateZip: 'New Delhi 110001',
      phone: '+91 96060 76606',
      email: '3dprintheritage@gmail.com'
    },

    // Line Items
    items: [
      {
        id: 'item-1',
        name: 'Brochure design',
        description: '',
        quantity: 4.00,
        price: 350
      },
      {
        id: 'item-2',
        name: 'Email Signature Design',
        description: '',
        quantity: 1.00,
        price: 750
      }
    ],

    // Financial Controls
    discountType: 'percentage',
    discountValue: 0,
    taxRate: 0,
    shippingFee: 0,

    // Notes
    notes: 'Please make payment to our designated accounts. Mention invoice number in reference.',
    terms: ''
  };

  // Cache DOM Elements
  const elements = {
    // Buttons & Controls
    btnInvoiceType: document.getElementById('btnInvoiceType'),
    btnQuotationType: document.getElementById('btnQuotationType'),
    btnReceiptType: document.getElementById('btnReceiptType'),
    productDropdown: document.getElementById('productDropdown'),
    btnAddPredefinedProduct: document.getElementById('btnAddPredefinedProduct'),
    btnAddCustomItem: document.getElementById('btnAddCustomItem'),
    btnDownloadPdf: document.getElementById('btnDownloadPdf'),
    btnPrintPdf: document.getElementById('btnPrintPdf'),
    btnWhatsAppShare: document.getElementById('btnWhatsAppShare'),
    btnResetData: document.getElementById('btnResetData'),

    // Toggles & Sections
    toggleTaxesSection: document.getElementById('toggleTaxesSection'),
    taxesControlsGrid: document.getElementById('taxesControlsGrid'),
    toggleGstCheckbox: document.getElementById('toggleGstCheckbox'),
    toggleNotesSection: document.getElementById('toggleNotesSection'),
    notesControlsGrid: document.getElementById('notesControlsGrid'),

    // Receipt Section Elements
    // Editor Form Sections & Controls
    configSectionTitle: document.getElementById('configSectionTitle'),
    docNumberLabel: document.getElementById('docNumberLabel'),
    docStatusGroup: document.getElementById('docStatusGroup'),
    issueDateLabel: document.getElementById('issueDateLabel'),
    dueDateGroup: document.getElementById('dueDateGroup'),

    receiptDetailsSection: document.getElementById('receiptDetailsSection'),
    paymentModeSelect: document.getElementById('paymentModeSelect'),
    amountPaidInput: document.getElementById('amountPaidInput'),
    creditedToInput: document.getElementById('creditedToInput'),
    forNoteInput: document.getElementById('forNoteInput'),

    clientSectionHeading: document.getElementById('clientSectionHeading'),
    clientNameLabel: document.getElementById('clientNameLabel'),
    clientBusinessGroup: document.getElementById('clientBusinessGroup'),
    clientBusinessInput: document.getElementById('clientBusinessInput'),
    clientEmailGroup: document.getElementById('clientEmailGroup'),
    clientAddressGroup: document.getElementById('clientAddressGroup'),

    itemsSection: document.getElementById('itemsSection'),
    taxesSection: document.getElementById('taxesSection'),
    shippingFeeGroup: document.getElementById('shippingFeeGroup'),

    notesSection: document.getElementById('notesSection'),
    notesInputGroup: document.getElementById('notesInputGroup'),
    termsInputGroup: document.getElementById('termsInputGroup'),

    currencySelect: document.getElementById('currencySelect'),
    docNumberInput: document.getElementById('docNumberInput'),
    docStatusSelect: document.getElementById('docStatusSelect'),
    advancePaidGroup: document.getElementById('advancePaidGroup'),
    advancePaidInput: document.getElementById('advancePaidInput'),
    issueDateInput: document.getElementById('issueDateInput'),
    dueDateInput: document.getElementById('dueDateInput'),
    dueDateLabel: document.getElementById('dueDateLabel'),

    clientNameInput: document.getElementById('clientNameInput'),
    clientPhoneInput: document.getElementById('clientPhoneInput'),
    clientEmailInput: document.getElementById('clientEmailInput'),
    clientAddressInput: document.getElementById('clientAddressInput'),

    discountTypeSelect: document.getElementById('discountTypeSelect'),
    discountValueInput: document.getElementById('discountValueInput'),
    taxRateInput: document.getElementById('taxRateInput'),
    shippingFeeInput: document.getElementById('shippingFeeInput'),

    notesInput: document.getElementById('notesInput'),
    termsInput: document.getElementById('termsInput'),

    editorItemsList: document.getElementById('editorItemsList'),

    // Preview Elements
    previewBrandName: document.getElementById('previewBrandName'),
    previewHeaderRight: document.getElementById('previewHeaderRight'),
    previewMetaSection: document.getElementById('previewMetaSection'),
    previewClientBlock: document.getElementById('previewClientBlock'),
    previewClientHeaderLabel: document.getElementById('previewClientHeaderLabel'),
    previewClientName: document.getElementById('previewClientName'),
    previewClientBusiness: document.getElementById('previewClientBusiness'),
    previewClientAddress: document.getElementById('previewClientAddress'),
    previewClientPhone: document.getElementById('previewClientPhone'),
    previewClientEmail: document.getElementById('previewClientEmail'),

    previewDocNumLabel: document.getElementById('previewDocNumLabel'),
    previewDocNumber: document.getElementById('previewDocNumber'),
    previewIssueDateLabel: document.getElementById('previewIssueDateLabel'),
    previewIssueDate: document.getElementById('previewIssueDate'),
    previewDueDateRow: document.getElementById('previewDueDateRow'),
    previewDueDateLabel: document.getElementById('previewDueDateLabel'),
    previewDueDate: document.getElementById('previewDueDate'),
    previewStatusRow: document.getElementById('previewStatusRow'),
    previewStatusVal: document.getElementById('previewStatusVal'),

    previewReceiptSection: document.getElementById('previewReceiptSection'),
    previewReceiptNumVal: document.getElementById('previewReceiptNumVal'),
    previewReceiptDateVal: document.getElementById('previewReceiptDateVal'),
    pdfTopAccent: document.getElementById('pdfTopAccent'),
    pdfHeaderDivider: document.getElementById('pdfHeaderDivider'),

    previewReceiptCard: document.getElementById('previewReceiptCard'),
    previewReceiptAmountBig: document.getElementById('previewReceiptAmountBig'),
    previewReceiptAckClient: document.getElementById('previewReceiptAckClient'),
    previewReceiptAckAmount: document.getElementById('previewReceiptAckAmount'),
    previewReceiptPaymentMethod: document.getElementById('previewReceiptPaymentMethod'),
    previewReceiptCredited: document.getElementById('previewReceiptCredited'),
    previewReceiptForInvNum: document.getElementById('previewReceiptForInvNum'),
    previewReceiptForItems: document.getElementById('previewReceiptForItems'),
    previewReceiptSigCompany: document.getElementById('previewReceiptSigCompany'),

    previewItemsWrapper: document.getElementById('previewItemsWrapper'),
    previewItemsTableBody: document.getElementById('previewItemsTableBody'),

    previewSummarySection: document.getElementById('previewSummarySection'),
    previewNotesCol: document.getElementById('previewNotesCol'),
    previewNotesHeader: document.getElementById('previewNotesHeader'),
    previewNotesText: document.getElementById('previewNotesText'),

    previewTotalsBox: document.getElementById('previewTotalsBox'),
    previewSubtotalRow: document.getElementById('previewSubtotalRow'),
    previewSubtotal: document.getElementById('previewSubtotal'),
    previewAdvanceRow: document.getElementById('previewAdvanceRow'),
    previewAdvanceVal: document.getElementById('previewAdvanceVal'),
    previewDiscountRow: document.getElementById('previewDiscountRow'),
    previewDiscountLabel: document.getElementById('previewDiscountLabel'),
    previewDiscountVal: document.getElementById('previewDiscountVal'),
    previewTaxRow: document.getElementById('previewTaxRow'),
    previewTaxLabel: document.getElementById('previewTaxLabel'),
    previewTaxVal: document.getElementById('previewTaxVal'),
    previewTotalLabel: document.getElementById('previewTotalLabel'),
    previewGrandTotal: document.getElementById('previewGrandTotal'),

    previewFooterAddress: document.getElementById('previewFooterAddress'),
    previewFooterContact: document.getElementById('previewFooterContact'),
    previewFooterSub: document.getElementById('previewFooterSub'),

    toast: document.getElementById('toastMsg'),
    toastContent: document.getElementById('toastContent')
  };

  // Init App
  function init() {
    populateProductDropdown();
    loadFromLocalStorage();
    bindEvents();
    renderFormValues();
    renderPreview();
  }

  // Populate Dropdown Options
  function populateProductDropdown() {
    if (!window.PREDEFINED_PRODUCTS || !elements.productDropdown) return;
    elements.productDropdown.innerHTML = '<option value="">-- Choose Predefined Product / Service --</option>';
    
    PREDEFINED_PRODUCTS.forEach(product => {
      const opt = document.createElement('option');
      opt.value = product.id;
      opt.textContent = `${product.name} (${state.currency}${product.price.toLocaleString('en-IN')})`;
      elements.productDropdown.appendChild(opt);
    });
  }

  // Event Listeners Setup
  function bindEvents() {
    // Document Type Switcher
    elements.btnInvoiceType.addEventListener('click', () => setDocType('invoice'));
    elements.btnQuotationType.addEventListener('click', () => setDocType('quotation'));
    if (elements.btnReceiptType) {
      elements.btnReceiptType.addEventListener('click', () => setDocType('receipt'));
    }

    // Section Toggles
    if (elements.toggleTaxesSection) {
      elements.toggleTaxesSection.addEventListener('change', (e) => {
        state.enableTaxesSection = e.target.checked;
        elements.taxesControlsGrid.style.display = state.enableTaxesSection ? 'grid' : 'none';
        renderPreview();
        saveToLocalStorage();
      });
    }

    if (elements.toggleGstCheckbox) {
      elements.toggleGstCheckbox.addEventListener('change', (e) => {
        state.enableGst = e.target.checked;
        elements.taxRateInput.disabled = !state.enableGst;
        renderPreview();
        saveToLocalStorage();
      });
    }

    if (elements.toggleNotesSection) {
      elements.toggleNotesSection.addEventListener('change', (e) => {
        state.enableNotesSection = e.target.checked;
        elements.notesControlsGrid.style.display = state.enableNotesSection ? 'grid' : 'none';
        renderPreview();
        saveToLocalStorage();
      });
    }

    // Input Changes -> State Sync
    elements.currencySelect.addEventListener('change', (e) => {
      state.currency = e.target.value;
      populateProductDropdown();
      renderFormValues();
      renderPreview();
      saveToLocalStorage();
    });

    elements.docNumberInput.addEventListener('input', (e) => { state.docNumber = e.target.value; renderPreview(); saveToLocalStorage(); });
    if (elements.docStatusSelect) {
      elements.docStatusSelect.addEventListener('change', (e) => { state.docStatus = e.target.value; renderPreview(); saveToLocalStorage(); });
    }
    if (elements.advancePaidInput) {
      elements.advancePaidInput.addEventListener('input', (e) => { state.advancePaid = parseFloat(e.target.value) || 0; renderPreview(); saveToLocalStorage(); });
    }
    elements.issueDateInput.addEventListener('input', (e) => { state.issueDate = e.target.value; renderPreview(); saveToLocalStorage(); });
    elements.dueDateInput.addEventListener('input', (e) => { state.dueDate = e.target.value; renderPreview(); saveToLocalStorage(); });

    elements.clientNameInput.addEventListener('input', (e) => { state.client.name = e.target.value; renderPreview(); saveToLocalStorage(); });
    if (elements.clientBusinessInput) {
      elements.clientBusinessInput.addEventListener('input', (e) => { state.client.businessName = e.target.value; renderPreview(); saveToLocalStorage(); });
    }
    elements.clientPhoneInput.addEventListener('input', (e) => { state.client.phone = e.target.value; renderPreview(); saveToLocalStorage(); });
    elements.clientEmailInput.addEventListener('input', (e) => { state.client.email = e.target.value; renderPreview(); saveToLocalStorage(); });
    elements.clientAddressInput.addEventListener('input', (e) => { state.client.address = e.target.value; renderPreview(); saveToLocalStorage(); });

    if (elements.paymentModeSelect) {
      elements.paymentModeSelect.addEventListener('change', (e) => { state.receipt.paymentMode = e.target.value; renderPreview(); saveToLocalStorage(); });
    }
    if (elements.amountPaidInput) {
      elements.amountPaidInput.addEventListener('input', (e) => { state.receipt.amountPaid = parseFloat(e.target.value) || 0; renderPreview(); saveToLocalStorage(); });
    }
    if (elements.creditedToInput) {
      elements.creditedToInput.addEventListener('input', (e) => { state.receipt.creditedTo = e.target.value; renderPreview(); saveToLocalStorage(); });
    }
    if (elements.forNoteInput) {
      elements.forNoteInput.addEventListener('input', (e) => { state.receipt.forNote = e.target.value; renderPreview(); saveToLocalStorage(); });
    }

    elements.discountTypeSelect.addEventListener('change', (e) => { state.discountType = e.target.value; renderPreview(); saveToLocalStorage(); });
    elements.discountValueInput.addEventListener('input', (e) => { state.discountValue = parseFloat(e.target.value) || 0; renderPreview(); saveToLocalStorage(); });
    elements.taxRateInput.addEventListener('input', (e) => { state.taxRate = parseFloat(e.target.value) || 0; renderPreview(); saveToLocalStorage(); });
    elements.shippingFeeInput.addEventListener('input', (e) => { state.shippingFee = parseFloat(e.target.value) || 0; renderPreview(); saveToLocalStorage(); });

    elements.notesInput.addEventListener('input', (e) => { state.notes = e.target.value; renderPreview(); saveToLocalStorage(); });
    elements.termsInput.addEventListener('input', (e) => { state.terms = e.target.value; renderPreview(); saveToLocalStorage(); });

    // Item Management Actions
    elements.productDropdown.addEventListener('change', () => {
      if (elements.productDropdown.value) {
        addSelectedPredefinedProduct();
      }
    });

    elements.btnAddPredefinedProduct.addEventListener('click', addSelectedPredefinedProduct);
    elements.btnAddCustomItem.addEventListener('click', addCustomItem);

    // Export Actions
    elements.btnDownloadPdf.addEventListener('click', downloadPdf);
    elements.btnPrintPdf.addEventListener('click', () => window.print());
    elements.btnWhatsAppShare.addEventListener('click', shareViaWhatsApp);
    elements.btnResetData.addEventListener('click', resetToDefaultData);
  }

  // Update Editor Form Visibility per Document Usecase (Invoice vs Quotation vs Receipt)
  function updateFormVisibility() {
    const type = state.docType;

    if (type === 'invoice') {
      if (elements.configSectionTitle) elements.configSectionTitle.textContent = 'Invoice Configuration';
      if (elements.docNumberLabel) elements.docNumberLabel.textContent = 'Invoice Number';
      if (elements.docStatusGroup) elements.docStatusGroup.style.display = 'block';
      if (elements.issueDateLabel) elements.issueDateLabel.textContent = 'Invoice Date';
      if (elements.dueDateGroup) elements.dueDateGroup.style.display = 'block';
      if (elements.dueDateLabel) elements.dueDateLabel.textContent = 'Due Date';
      if (elements.advancePaidGroup) elements.advancePaidGroup.style.display = 'block';

      if (elements.receiptDetailsSection) elements.receiptDetailsSection.style.display = 'none';

      if (elements.clientSectionHeading) elements.clientSectionHeading.textContent = 'Client Billing Info (BILL TO)';
      if (elements.clientNameLabel) elements.clientNameLabel.textContent = 'Client Name';
      if (elements.clientBusinessGroup) elements.clientBusinessGroup.style.display = 'block';
      if (elements.clientEmailGroup) elements.clientEmailGroup.style.display = 'block';
      if (elements.clientAddressGroup) elements.clientAddressGroup.style.display = 'block';

      if (elements.itemsSection) elements.itemsSection.style.display = 'block';
      if (elements.taxesSection) elements.taxesSection.style.display = 'block';
      if (elements.shippingFeeGroup) elements.shippingFeeGroup.style.display = 'block';

      if (elements.notesInputGroup) elements.notesInputGroup.style.display = 'block';
      if (elements.termsInputGroup) elements.termsInputGroup.style.display = 'block';

    } else if (type === 'quotation') {
      if (elements.configSectionTitle) elements.configSectionTitle.textContent = 'Quotation Configuration';
      if (elements.docNumberLabel) elements.docNumberLabel.textContent = 'Quotation Number';
      if (elements.docStatusGroup) elements.docStatusGroup.style.display = 'block';
      if (elements.issueDateLabel) elements.issueDateLabel.textContent = 'Quotation Date';
      if (elements.dueDateGroup) elements.dueDateGroup.style.display = 'block';
      if (elements.dueDateLabel) elements.dueDateLabel.textContent = 'Valid Until';
      if (elements.advancePaidGroup) elements.advancePaidGroup.style.display = 'none';

      if (elements.receiptDetailsSection) elements.receiptDetailsSection.style.display = 'none';

      if (elements.clientSectionHeading) elements.clientSectionHeading.textContent = 'Client Quotation Info (QUOTE FOR)';
      if (elements.clientNameLabel) elements.clientNameLabel.textContent = 'Client Name';
      if (elements.clientBusinessGroup) elements.clientBusinessGroup.style.display = 'block';
      if (elements.clientEmailGroup) elements.clientEmailGroup.style.display = 'block';
      if (elements.clientAddressGroup) elements.clientAddressGroup.style.display = 'block';

      if (elements.itemsSection) elements.itemsSection.style.display = 'block';
      if (elements.taxesSection) elements.taxesSection.style.display = 'block';
      if (elements.shippingFeeGroup) elements.shippingFeeGroup.style.display = 'none';

      if (elements.notesInputGroup) elements.notesInputGroup.style.display = 'none';
      if (elements.termsInputGroup) elements.termsInputGroup.style.display = 'block';

    } else if (type === 'receipt') {
      if (elements.configSectionTitle) elements.configSectionTitle.textContent = 'Receipt Configuration';
      if (elements.docNumberLabel) elements.docNumberLabel.textContent = 'Receipt Number';
      if (elements.docStatusGroup) elements.docStatusGroup.style.display = 'none';
      if (elements.issueDateLabel) elements.issueDateLabel.textContent = 'Receipt Date';
      if (elements.dueDateGroup) elements.dueDateGroup.style.display = 'none';
      if (elements.advancePaidGroup) elements.advancePaidGroup.style.display = 'none';

      if (elements.receiptDetailsSection) elements.receiptDetailsSection.style.display = 'block';

      if (elements.clientSectionHeading) elements.clientSectionHeading.textContent = 'Payer Details (RECEIVED WITH THANKS FROM)';
      if (elements.clientNameLabel) elements.clientNameLabel.textContent = 'Payer / Client Name';
      if (elements.clientBusinessGroup) elements.clientBusinessGroup.style.display = 'none';
      if (elements.clientEmailGroup) elements.clientEmailGroup.style.display = 'none';
      if (elements.clientAddressGroup) elements.clientAddressGroup.style.display = 'none';

      if (elements.itemsSection) elements.itemsSection.style.display = 'none';
      if (elements.taxesSection) elements.taxesSection.style.display = 'none';

      if (elements.notesInputGroup) elements.notesInputGroup.style.display = 'block';
      if (elements.termsInputGroup) elements.termsInputGroup.style.display = 'none';
    }
  }

  // Set Document Type (Invoice vs Quotation vs Receipt)
  function setDocType(type) {
    const prevType = state.docType;
    state.docType = type;

    // Reset button states
    elements.btnInvoiceType.classList.remove('active');
    elements.btnQuotationType.classList.remove('active');
    if (elements.btnReceiptType) elements.btnReceiptType.classList.remove('active');

    if (type === 'invoice') {
      elements.btnInvoiceType.classList.add('active');
      state.docNumber = 'INV-20260707-731';
      state.docStatus = 'SENT';
      state.issueDate = '2026-07-07';
      state.dueDate = '2026-07-21';
      state.advancePaid = 0;
      state.client = {
        name: 'Priya',
        businessName: 'PRIME TECH Equipments Repairing L.L.C',
        phone: '+91 55 303 3714',
        email: 'smitha@primemea.com',
        address: 'Al-Quoz Ind-2, Dubai, U.A.E.'
      };
      state.items = [
        { id: 'item-1', name: 'Brochure design', description: '', quantity: 4.00, price: 350 },
        { id: 'item-2', name: 'Email Signature Design', description: '', quantity: 1.00, price: 750 }
      ];
      state.notes = 'Please make payment to our designated accounts. Mention invoice number in reference.';

    } else if (type === 'quotation') {
      elements.btnQuotationType.classList.add('active');
      state.docNumber = 'QUO-20260712-482';
      state.docStatus = 'SENT';
      state.issueDate = '2026-07-12';
      state.dueDate = '2026-08-11';
      state.client = {
        name: 'Adversetic',
        businessName: '',
        phone: '+91 63850 38173',
        email: '',
        address: 'No:6, First Floor, Velappan Street, Ramasamy Nagar,\nKoundampalayam, Coimbatore, Tamil Nadu 641030,\nIndia'
      };
      state.items = [
        { id: 'item-1', name: 'Web Development', description: '', quantity: 1.00, price: 8500 },
        { id: 'item-2', name: 'Hosting 1 Year', description: '', quantity: 1.00, price: 3000 },
        { id: 'item-3', name: 'Maintenance 1 Year', description: '', quantity: 1.00, price: 1000 },
        { id: 'item-4', name: 'Domain Purchase .com 1 Year', description: '', quantity: 1.00, price: 750 }
      ];
      state.notes = '';

    } else if (type === 'receipt') {
      if (elements.btnReceiptType) elements.btnReceiptType.classList.add('active');
      state.docNumber = 'REC-20260726-710';
      state.docStatus = 'PAID';
      state.issueDate = '2026-07-26';
      state.client = {
        name: 'Priya',
        businessName: '',
        phone: '+91 55 303 3714',
        email: 'smitha@primemea.com',
        address: ''
      };
      state.receipt.amountPaid = 2150;
      state.receipt.paymentMode = 'Bank Transfer';
      state.receipt.creditedTo = '3DHeritage Account';
      state.receipt.forNote = 'For Invoice #INV-20260707-731: Brochure design, Email Signature Design';
    }

    renderFormValues();
    renderPreview();
    saveToLocalStorage();
  }

  // Add Predefined Product
  function addSelectedPredefinedProduct() {
    const selectedId = elements.productDropdown.value;
    if (!selectedId) {
      showToast('Please select a product from the dropdown first', 'info');
      return;
    }
    const product = PREDEFINED_PRODUCTS.find(p => p.id === selectedId);
    if (product) {
      state.items.push({
        id: 'item-' + Date.now(),
        name: product.name,
        description: product.description || '',
        quantity: 1.00,
        price: product.price
      });
      elements.productDropdown.value = '';
      renderEditorItems();
      renderPreview();
      saveToLocalStorage();
      showToast(`Added "${product.name}" to line items`, 'success');
    }
  }

  // Add Custom Item
  function addCustomItem() {
    state.items.push({
      id: 'item-' + Date.now(),
      name: 'Custom Service / Item',
      description: '',
      quantity: 1.00,
      price: 1000
    });
    renderEditorItems();
    renderPreview();
    saveToLocalStorage();
  }

  // Render Editor Items List
  function renderEditorItems() {
    elements.editorItemsList.innerHTML = '';

    if (state.items.length === 0) {
      elements.editorItemsList.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; color: #94a3b8; padding: 16px;">
            No items added yet. Choose from dropdown or click "+ Custom Item".
          </td>
        </tr>
      `;
      return;
    }

    state.items.forEach((item, index) => {
      const tr = document.createElement('tr');
      tr.className = 'item-row';
      const itemTotal = item.quantity * item.price;

      tr.innerHTML = `
        <td>
          <input type="text" class="form-control item-name-input" value="${escapeHtml(item.name)}" placeholder="Item title">
          <textarea class="form-control item-desc-input" style="margin-top: 4px;" placeholder="Description (optional)">${escapeHtml(item.description || '')}</textarea>
        </td>
        <td style="width: 80px;">
          <input type="number" class="form-control item-qty-input" value="${item.quantity}" min="0.01" step="1">
        </td>
        <td style="width: 120px;">
          <input type="number" class="form-control item-price-input" value="${item.price}" min="0" step="10">
        </td>
        <td style="width: 110px; font-weight: 700; font-family: var(--font-body); vertical-align: middle;" class="item-total-cell">
          ${state.currency}${itemTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </td>
        <td style="width: 40px; vertical-align: middle;">
          <button class="btn-remove-item" title="Remove Item"><i class="fa-solid fa-trash-can"></i></button>
        </td>
      `;

      // Event Listeners for Row Inputs
      const nameInput = tr.querySelector('.item-name-input');
      const descInput = tr.querySelector('.item-desc-input');
      const qtyInput = tr.querySelector('.item-qty-input');
      const priceInput = tr.querySelector('.item-price-input');
      const totalCell = tr.querySelector('.item-total-cell');
      const removeBtn = tr.querySelector('.btn-remove-item');

      nameInput.addEventListener('input', (e) => {
        state.items[index].name = e.target.value;
        renderPreview();
        saveToLocalStorage();
      });

      descInput.addEventListener('input', (e) => {
        state.items[index].description = e.target.value;
        renderPreview();
        saveToLocalStorage();
      });

      const updateRowTotal = () => {
        const q = parseFloat(qtyInput.value) || 0;
        const p = parseFloat(priceInput.value) || 0;
        state.items[index].quantity = q;
        state.items[index].price = p;
        totalCell.textContent = `${state.currency}${(q * p).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        renderPreview();
        saveToLocalStorage();
      };

      qtyInput.addEventListener('input', updateRowTotal);
      priceInput.addEventListener('input', updateRowTotal);

      removeBtn.addEventListener('click', () => {
        state.items.splice(index, 1);
        renderEditorItems();
        renderPreview();
        saveToLocalStorage();
      });

      elements.editorItemsList.appendChild(tr);
    });
  }

  // Render Form Input Values from State
  function renderFormValues() {
    updateFormVisibility();

    elements.currencySelect.value = state.currency;
    elements.docNumberInput.value = state.docNumber;
    if (elements.docStatusSelect) elements.docStatusSelect.value = state.docStatus || 'SENT';
    if (elements.advancePaidInput) elements.advancePaidInput.value = state.advancePaid || 0;
    elements.issueDateInput.value = state.issueDate;
    elements.dueDateInput.value = state.dueDate;

    if (elements.toggleTaxesSection) elements.toggleTaxesSection.checked = state.enableTaxesSection !== false;
    if (elements.taxesControlsGrid) elements.taxesControlsGrid.style.display = state.enableTaxesSection !== false ? 'grid' : 'none';

    if (elements.toggleGstCheckbox) {
      elements.toggleGstCheckbox.checked = state.enableGst !== false;
      elements.taxRateInput.disabled = state.enableGst === false;
    }

    if (elements.toggleNotesSection) elements.toggleNotesSection.checked = state.enableNotesSection !== false;
    if (elements.notesControlsGrid) elements.notesControlsGrid.style.display = state.enableNotesSection !== false ? 'grid' : 'none';

    if (elements.paymentModeSelect) elements.paymentModeSelect.value = state.receipt.paymentMode || 'Bank Transfer';
    if (elements.amountPaidInput) elements.amountPaidInput.value = state.receipt.amountPaid || 2150;
    if (elements.creditedToInput) elements.creditedToInput.value = state.receipt.creditedTo || `${state.company.name} Account`;
    if (elements.forNoteInput) elements.forNoteInput.value = state.receipt.forNote || 'For Invoice #INV-20260707-731: Brochure design, Email Signature Design';

    elements.clientNameInput.value = state.client.name || '';
    if (elements.clientBusinessInput) elements.clientBusinessInput.value = state.client.businessName || '';
    elements.clientPhoneInput.value = state.client.phone || '';
    if (elements.clientEmailInput) elements.clientEmailInput.value = state.client.email || '';
    if (elements.clientAddressInput) elements.clientAddressInput.value = state.client.address || '';

    elements.discountTypeSelect.value = state.discountType;
    elements.discountValueInput.value = state.discountValue;
    elements.taxRateInput.value = state.taxRate;
    elements.shippingFeeInput.value = state.shippingFee;

    elements.notesInput.value = state.notes || '';
    elements.termsInput.value = state.terms || '';

    renderEditorItems();
  }

  // Render Live Preview PDF Sheet (Simple & Neat matching user template images)
  function renderPreview() {
    // 1. Header Right & Accent Top Bar
    if (elements.pdfTopAccent) elements.pdfTopAccent.style.display = state.docType === 'receipt' ? 'block' : 'none';
    if (elements.pdfHeaderDivider) elements.pdfHeaderDivider.style.display = state.docType === 'receipt' ? 'none' : 'block';

    if (state.docType === 'receipt') {
      elements.previewHeaderRight.innerHTML = `<div class="pdf-receipt-title">RECEIPT</div>`;
    } else {
      elements.previewHeaderRight.innerHTML = `
        <div class="pdf-company-name">${escapeHtml(state.company.name)}</div>
        <div class="pdf-company-addr">${escapeHtml(state.company.address)}</div>
        <div class="pdf-company-city">${escapeHtml(state.company.cityStateZip)}</div>
        <div class="pdf-company-contact">Phone: ${escapeHtml(state.company.phone)}</div>
        <div class="pdf-company-email">Email : ${escapeHtml(state.company.email)}</div>
      `;
    }

    // 2. Client & Meta Info Logic
    if (state.docType === 'receipt') {
      if (elements.previewMetaSection) elements.previewMetaSection.style.display = 'none';
      if (elements.previewReceiptSection) elements.previewReceiptSection.style.display = 'block';

      if (elements.previewReceiptNumVal) elements.previewReceiptNumVal.textContent = `#${state.docNumber}`;
      if (elements.previewReceiptDateVal) elements.previewReceiptDateVal.textContent = formatDate(state.issueDate);

      // Receipt Card & Details
      const recAmount = state.receipt.amountPaid || calculateTotal();
      if (elements.previewReceiptAmountBig) elements.previewReceiptAmountBig.textContent = `${state.currency}${recAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

      if (elements.previewReceiptAckClient) elements.previewReceiptAckClient.textContent = state.client.name || 'Client Name';
      if (elements.previewReceiptAckAmount) elements.previewReceiptAckAmount.textContent = `${state.currency}${recAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

      if (elements.previewReceiptPaymentMethod) elements.previewReceiptPaymentMethod.textContent = state.receipt.paymentMode || 'Bank Transfer';
      if (elements.previewReceiptCredited) elements.previewReceiptCredited.textContent = state.receipt.creditedTo || `${state.company.name} Account`;
      
      const forNoteElem = document.getElementById('previewReceiptForNotes');
      if (forNoteElem) {
        if (state.receipt.forNote && state.receipt.forNote.trim()) {
          forNoteElem.innerHTML = escapeHtml(state.receipt.forNote);
        } else {
          const itemNames = state.items.map(i => i.name).filter(Boolean).join(', ');
          const invRef = state.docNumber.replace(/^REC-/, 'INV-');
          forNoteElem.innerHTML = `For: Invoice #${escapeHtml(invRef)}: ${escapeHtml(itemNames || '3D Modeling Services')}`;
        }
      }

      if (elements.previewReceiptSigCompany) elements.previewReceiptSigCompany.textContent = state.company.name || '3DHeritage';

      // Hide Items & Totals box on Receipt mode
      if (elements.previewItemsWrapper) elements.previewItemsWrapper.style.display = 'none';
      if (elements.previewSummarySection) elements.previewSummarySection.style.display = 'none';

    } else {
      // Invoice & Quotation layout
      if (elements.previewMetaSection) elements.previewMetaSection.style.display = 'grid';
      if (elements.previewReceiptSection) elements.previewReceiptSection.style.display = 'none';
      if (elements.previewItemsWrapper) elements.previewItemsWrapper.style.display = 'block';
      if (elements.previewSummarySection) elements.previewSummarySection.style.display = 'flex';

      // Client Section
      if (elements.previewClientHeaderLabel) elements.previewClientHeaderLabel.textContent = state.docType === 'invoice' ? 'BILL TO:' : 'QUOTE FOR:';
      if (elements.previewClientName) elements.previewClientName.textContent = state.client.name || '';
      if (elements.previewClientBusiness) {
        elements.previewClientBusiness.textContent = state.client.businessName || '';
        elements.previewClientBusiness.style.display = state.client.businessName ? 'block' : 'none';
      }

      const addrLines = (state.client.address || '').split('\n').map(l => escapeHtml(l.trim())).filter(Boolean).join('<br>');
      if (elements.previewClientAddress) {
        elements.previewClientAddress.innerHTML = addrLines;
        elements.previewClientAddress.style.display = state.client.address ? 'block' : 'none';
      }

      if (elements.previewClientPhone) {
        elements.previewClientPhone.textContent = state.client.phone ? `Phone: ${state.client.phone}` : '';
        elements.previewClientPhone.style.display = state.client.phone ? 'block' : 'none';
      }

      if (elements.previewClientEmail) {
        elements.previewClientEmail.textContent = state.client.email ? `Email: ${state.client.email}` : '';
        elements.previewClientEmail.style.display = state.client.email ? 'block' : 'none';
      }

      // Meta Block Right
      if (elements.previewDocNumLabel) elements.previewDocNumLabel.textContent = state.docType === 'invoice' ? 'Invoice Number:' : 'Quotation Number:';
      if (elements.previewDocNumber) elements.previewDocNumber.textContent = `#${state.docNumber}`;
      
      if (elements.previewIssueDateLabel) elements.previewIssueDateLabel.textContent = state.docType === 'invoice' ? 'Invoice Date:' : 'Date:';
      if (elements.previewIssueDate) elements.previewIssueDate.textContent = formatDate(state.issueDate);

      if (state.docType === 'quotation') {
        if (elements.previewDueDateRow) elements.previewDueDateRow.style.display = 'block';
        if (elements.previewDueDateLabel) elements.previewDueDateLabel.textContent = 'Valid Until:';
        if (elements.previewDueDate) elements.previewDueDate.textContent = formatDate(state.dueDate);
      } else {
        if (elements.previewDueDateRow) elements.previewDueDateRow.style.display = 'none';
      }

      if (elements.previewStatusVal) {
        elements.previewStatusVal.textContent = state.docStatus || 'SENT';
        if (state.docStatus === 'PAID' || state.docStatus === 'APPROVED') {
          elements.previewStatusVal.className = 'pdf-meta-val status-badge status-paid';
        } else {
          elements.previewStatusVal.className = 'pdf-meta-val status-badge';
        }
      }

      // Line Items Table
      elements.previewItemsTableBody.innerHTML = '';
      let subtotal = 0;

      state.items.forEach(item => {
        const lineTotal = item.quantity * item.price;
        subtotal += lineTotal;

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td style="text-align: left;">
            <div class="pdf-item-title">${escapeHtml(item.name)}</div>
            ${item.description ? `<div class="pdf-item-desc">${escapeHtml(item.description)}</div>` : ''}
          </td>
          <td style="text-align: center;">${parseFloat(item.quantity).toFixed(2)}</td>
          <td style="text-align: right;">${state.currency}${item.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td style="text-align: right;">${state.currency}${lineTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        `;
        elements.previewItemsTableBody.appendChild(tr);
      });

      // Calculations & Totals
      let discountAmount = 0;
      let taxAmount = 0;

      if (state.enableTaxesSection) {
        discountAmount = state.discountType === 'percentage' ? (subtotal * state.discountValue) / 100 : state.discountValue;
        const subAfterDisc = Math.max(0, subtotal - discountAmount);
        if (state.enableGst) {
          taxAmount = (subAfterDisc * state.taxRate) / 100;
        }
      }

      const grandTotal = Math.round(subtotal - discountAmount + taxAmount + (state.enableTaxesSection ? (state.shippingFee || 0) : 0));
      const advancePaid = state.advancePaid || 0;
      const balanceDue = Math.max(0, grandTotal - advancePaid);

      elements.previewSubtotal.textContent = `${state.currency}${subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

      if (state.docType === 'invoice') {
        elements.previewAdvanceRow.style.display = 'table-row';
        elements.previewAdvanceVal.textContent = `${state.currency}${advancePaid.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        elements.previewTotalLabel.textContent = 'Balance Due:';
        elements.previewGrandTotal.textContent = `${state.currency}${balanceDue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      } else {
        elements.previewAdvanceRow.style.display = 'none';
        elements.previewTotalLabel.textContent = 'Grand Total:';
        elements.previewGrandTotal.textContent = `${state.currency}${grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }

      // Discount & Tax rows
      if (state.enableTaxesSection && discountAmount > 0) {
        elements.previewDiscountRow.style.display = 'table-row';
        elements.previewDiscountLabel.textContent = state.discountType === 'percentage' ? `Discount (${state.discountValue}%):` : 'Discount:';
        elements.previewDiscountVal.textContent = `-${state.currency}${discountAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      } else {
        elements.previewDiscountRow.style.display = 'none';
      }

      if (state.enableTaxesSection && state.enableGst && taxAmount > 0) {
        elements.previewTaxRow.style.display = 'table-row';
        elements.previewTaxLabel.textContent = `Tax / GST (${state.taxRate}%):`;
        elements.previewTaxVal.textContent = `+${state.currency}${taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      } else {
        elements.previewTaxRow.style.display = 'none';
      }

      // Payment Notes Section
      if (state.notes && state.notes.trim()) {
        elements.previewNotesCol.style.display = 'block';
        elements.previewNotesHeader.textContent = 'PAYMENT NOTES:';
        elements.previewNotesText.innerHTML = escapeHtml(state.notes).replace(/\n/g, '<br>');
      } else {
        elements.previewNotesCol.style.display = 'none';
      }
    }

    // Footer Message
    if (elements.previewFooterAddress) elements.previewFooterAddress.textContent = `${state.company.address}, ${state.company.cityStateZip}`;
    if (elements.previewFooterContact) elements.previewFooterContact.textContent = `${state.company.email} | ${state.company.phone}`;
    if (elements.previewFooterSub) elements.previewFooterSub.textContent = state.docType === 'receipt' ? 'This is an electronically generated receipt.' : `This is a computer-generated ${state.docType} and does not require a signature.`;
  }

  // Calculate total helper
  function calculateTotal() {
    let subtotal = state.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    if (!state.enableTaxesSection) return subtotal;
    let disc = state.discountType === 'percentage' ? (subtotal * state.discountValue) / 100 : state.discountValue;
    let afterDisc = Math.max(0, subtotal - disc);
    let tax = state.enableGst ? (afterDisc * state.taxRate) / 100 : 0;
    return Math.round(afterDisc + tax + (state.shippingFee || 0));
  }

  // Print Document (Distinct from Download PDF)
  function printPdf() {
    showToast('Opening print dialog...', 'info');
    window.print();
  }

  // Export & Download PDF File (Vector PDF save via Blob URL)
  async function downloadPdf() {
    const sheet = document.getElementById('pdfDocSheet');
    if (!sheet) return;

    const safeDocNum = (state.docNumber || 'DOC-001').replace(/[^a-zA-Z0-9_-]/g, '_');
    const defaultFilename = `${state.company.name}_${state.docType.toUpperCase()}_${safeDocNum}.pdf`;

    showToast(`Generating ${defaultFilename}...`, 'info');

    try {
      if (typeof html2pdf !== 'undefined') {
        const opt = {
          margin:       0,
          filename:     defaultFilename,
          image:        { type: 'jpeg', quality: 0.98 },
          html2canvas:  { scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff' },
          jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        
        const pdfWorker = html2pdf().set(opt).from(sheet);
        const pdfBlob = await pdfWorker.output('blob');
        
        const blobUrl = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = blobUrl;
        link.download = defaultFilename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 15000);

        showToast(`Downloaded PDF: ${defaultFilename}`, 'success');
        return;
      }

      // Fallback html2canvas + jsPDF blob save
      const canvas = await html2canvas(sheet, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const jsPDFConstructor = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
      
      if (jsPDFConstructor) {
        const pdf = new jsPDFConstructor({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
        
        const pdfBlob = pdf.output('blob');
        const blobUrl = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = blobUrl;
        link.download = defaultFilename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 15000);

        showToast(`Downloaded PDF: ${defaultFilename}`, 'success');
      } else {
        throw new Error('PDF generator library loading');
      }
    } catch (err) {
      console.error('PDF export error:', err);
      showToast('PDF download failed. Try using Print -> Save as PDF.', 'warning');
    }
  }

  // Direct WhatsApp Sharing
  function shareViaWhatsApp() {
    let rawPhone = state.client.phone || '';
    let cleanPhone = rawPhone.replace(/\D/g, '');

    // Default to owner's number 916363297814 unless custom client phone is entered
    if (!cleanPhone || cleanPhone.includes('553033714') || cleanPhone.includes('9876543210')) {
      cleanPhone = '916363297814';
    } else if (cleanPhone.length === 10) {
      cleanPhone = '91' + cleanPhone;
    }

    const recAmount = state.receipt.amountPaid || calculateTotal();
    const totalAmount = state.docType === 'receipt' ? recAmount : calculateTotal();
    const typeUpper = state.docType.toUpperCase();

    const message = 
`Hello *${state.client.name || 'Valued Client'}*,

Here is your official *${typeUpper}* from *${state.company.name}*.

*Document:* ${typeUpper} #${state.docNumber}
*Date:* ${formatDate(state.issueDate)}
*Amount:* ${state.currency}${totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}

Thank you for choosing ${state.company.domain}!
*${state.company.name} Studio*
Email: 3dprintheritage@gmail.com
Phone: +91 96060 76606`;

    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
    showToast(`WhatsApp message opened for +${cleanPhone}!`, 'success');
  }

  // Reset to default sample data
  function resetToDefaultData() {
    if (confirm('Reset form data to default example?')) {
      localStorage.removeItem('scalevyn_crm_pdf_state');
      location.reload();
    }
  }

  // Helpers & LocalStorage
  function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }

  function showToast(message, type = 'info') {
    elements.toastContent.textContent = message;
    elements.toast.className = `toast-msg show ${type}`;
    setTimeout(() => {
      elements.toast.classList.remove('show');
    }, 4000);
  }

  function saveToLocalStorage() {
    try {
      localStorage.setItem('scalevyn_crm_pdf_state', JSON.stringify(state));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }

  function loadFromLocalStorage() {
    try {
      const saved = localStorage.getItem('scalevyn_crm_pdf_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        Object.assign(state, parsed);
      }
      state.currency = '₹';
    } catch (e) {
      console.warn('LocalStorage load failed', e);
    }
  }

  // Run App
  init();
});
