/* ==========================================================================
   HERITAGE INVOICE, QUOTATION & RECEIPT APPLICATION LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    docType: 'invoice', // 'invoice' | 'quotation' | 'receipt'
    currency: '₹',
    docNumber: 'INV-2026-001',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    
    // Optional Sections Control
    enableTaxesSection: true,
    enableGst: true,
    enableNotesSection: true,
    bankAccountType: 'business', // 'business' | 'upi' | 'custom' | 'hide'
    customBankDetails: 'Bank Name: HDFC Bank\nAccount Name: HERITAGE\nAccount No: 50200012345678 | IFSC: HDFC0001234',

    // Receipt Specific Data
    receipt: {
      paymentMode: 'UPI / GPay / PhonePe',
      transactionId: 'UPI/423891028391',
      amountPaid: 42000,
      paymentDate: new Date().toISOString().split('T')[0]
    },

    // Client Info
    client: {
      name: 'Acme Heritage Constructions',
      phone: '+91 98765 43210',
      email: 'contact@acmeheritage.com',
      address: 'Suite 402, Landmark Towers, MG Road, Bengaluru, KA - 560001'
    },

    // Company Info
    company: {
      name: 'HERITAGE',
      subtext: '3D & Design Solutions',
      address: '102 Heritage Creative Studio, Craft Sector, New Delhi',
      phone: '+91 96060 76606',
      email: 'info@heritage3d.com',
      website: 'www.heritage3d.com',
      taxId: 'GSTIN: 07AAAAA0000A1Z5'
    },

    // Line Items
    items: [
      {
        id: 'item-1',
        name: '3D Architectural Visualization',
        description: 'High-resolution exterior 3D rendering (4K photorealistic view)',
        quantity: 2,
        price: 15000
      },
      {
        id: 'item-2',
        name: 'Interior Design 3D Model & Rendering',
        description: 'Complete 3D interior design layout with custom textures & lighting',
        quantity: 1,
        price: 12000
      }
    ],

    // Calculations
    discountType: 'percentage', // 'percentage' | 'fixed'
    discountValue: 5,
    taxRate: 18,
    shippingFee: 0,

    // Terms & Notes
    notes: 'Thank you for choosing HERITAGE! Payment received with thanks.',
    terms: '1. 50% advance upon quotation approval.\n2. All 3D digital assets delivered after final payment.'
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

    // Bank Details Selector Elements
    bankAccountSelect: document.getElementById('bankAccountSelect'),
    customBankInputs: document.getElementById('customBankInputs'),
    customBankDetailsInput: document.getElementById('customBankDetailsInput'),

    // Toggles & Sections
    toggleTaxesSection: document.getElementById('toggleTaxesSection'),
    taxesControlsGrid: document.getElementById('taxesControlsGrid'),
    toggleGstCheckbox: document.getElementById('toggleGstCheckbox'),
    toggleNotesSection: document.getElementById('toggleNotesSection'),
    notesControlsGrid: document.getElementById('notesControlsGrid'),

    // Receipt Section Elements
    receiptDetailsSection: document.getElementById('receiptDetailsSection'),
    paymentModeSelect: document.getElementById('paymentModeSelect'),
    transactionIdInput: document.getElementById('transactionIdInput'),
    amountPaidInput: document.getElementById('amountPaidInput'),
    paymentDateInput: document.getElementById('paymentDateInput'),

    // Editor Form Inputs
    currencySelect: document.getElementById('currencySelect'),
    docNumberInput: document.getElementById('docNumberInput'),
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
    previewDocTitle: document.getElementById('previewDocTitle'),
    previewDocNumber: document.getElementById('previewDocNumber'),
    previewIssueDateLabel: document.getElementById('previewIssueDateLabel'),
    previewIssueDate: document.getElementById('previewIssueDate'),
    previewDueDateLabel: document.getElementById('previewDueDateLabel'),
    previewDueDate: document.getElementById('previewDueDate'),

    previewPaymentModeRow: document.getElementById('previewPaymentModeRow'),
    previewPaymentModeVal: document.getElementById('previewPaymentModeVal'),
    previewTransactionRow: document.getElementById('previewTransactionRow'),
    previewTransactionVal: document.getElementById('previewTransactionVal'),
    previewStatusVal: document.getElementById('previewStatusVal'),

    previewClientName: document.getElementById('previewClientName'),
    previewClientPhone: document.getElementById('previewClientPhone'),
    previewClientEmail: document.getElementById('previewClientEmail'),
    previewClientAddress: document.getElementById('previewClientAddress'),

    previewCompanyAddress: document.getElementById('previewCompanyAddress'),
    previewCompanyPhoneEmail: document.getElementById('previewCompanyPhoneEmail'),
    previewCompanyTaxId: document.getElementById('previewCompanyTaxId'),

    previewItemsTableBody: document.getElementById('previewItemsTableBody'),

    previewBankBlock: document.getElementById('previewBankBlock'),
    previewBankText: document.getElementById('previewBankText'),
    previewNotesBlock: document.getElementById('previewNotesBlock'),
    previewTermsBlock: document.getElementById('previewTermsBlock'),

    previewSubtotal: document.getElementById('previewSubtotal'),
    previewDiscountRow: document.getElementById('previewDiscountRow'),
    previewDiscountLabel: document.getElementById('previewDiscountLabel'),
    previewDiscountVal: document.getElementById('previewDiscountVal'),
    previewTaxRow: document.getElementById('previewTaxRow'),
    previewTaxLabel: document.getElementById('previewTaxLabel'),
    previewTaxVal: document.getElementById('previewTaxVal'),
    previewShippingRow: document.getElementById('previewShippingRow'),
    previewShippingVal: document.getElementById('previewShippingVal'),
    previewTotalLabel: document.getElementById('previewTotalLabel'),
    previewGrandTotal: document.getElementById('previewGrandTotal'),

    previewAmountPaidRow: document.getElementById('previewAmountPaidRow'),
    previewAmountPaidVal: document.getElementById('previewAmountPaidVal'),
    previewBalanceDueRow: document.getElementById('previewBalanceDueRow'),
    previewBalanceDueVal: document.getElementById('previewBalanceDueVal'),

    previewNotes: document.getElementById('previewNotes'),
    previewTerms: document.getElementById('previewTerms'),

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

  // Populate Dropdown Options from PREDEFINED_PRODUCTS
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

    // Bank Account Selector
    if (elements.bankAccountSelect) {
      elements.bankAccountSelect.addEventListener('change', (e) => {
        state.bankAccountType = e.target.value;
        if (state.bankAccountType === 'custom') {
          elements.customBankInputs.style.display = 'block';
        } else {
          elements.customBankInputs.style.display = 'none';
        }
        renderPreview();
        saveToLocalStorage();
      });
    }

    if (elements.customBankDetailsInput) {
      elements.customBankDetailsInput.addEventListener('input', (e) => {
        state.customBankDetails = e.target.value;
        renderPreview();
        saveToLocalStorage();
      });
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

    // Receipt Inputs
    elements.paymentModeSelect.addEventListener('change', (e) => { state.receipt.paymentMode = e.target.value; renderPreview(); saveToLocalStorage(); });
    elements.transactionIdInput.addEventListener('input', (e) => { state.receipt.transactionId = e.target.value; renderPreview(); saveToLocalStorage(); });
    elements.amountPaidInput.addEventListener('input', (e) => { state.receipt.amountPaid = parseFloat(e.target.value) || 0; renderPreview(); saveToLocalStorage(); });
    elements.paymentDateInput.addEventListener('input', (e) => { state.receipt.paymentDate = e.target.value; renderPreview(); saveToLocalStorage(); });

    // Input Changes -> State Sync
    elements.currencySelect.addEventListener('change', (e) => {
      state.currency = e.target.value;
      populateProductDropdown();
      renderFormValues();
      renderPreview();
      saveToLocalStorage();
    });

    elements.docNumberInput.addEventListener('input', (e) => { state.docNumber = e.target.value; renderPreview(); saveToLocalStorage(); });
    elements.issueDateInput.addEventListener('input', (e) => { state.issueDate = e.target.value; renderPreview(); saveToLocalStorage(); });
    elements.dueDateInput.addEventListener('input', (e) => { state.dueDate = e.target.value; renderPreview(); saveToLocalStorage(); });

    elements.clientNameInput.addEventListener('input', (e) => { state.client.name = e.target.value; renderPreview(); saveToLocalStorage(); });
    elements.clientPhoneInput.addEventListener('input', (e) => { state.client.phone = e.target.value; renderPreview(); saveToLocalStorage(); });
    elements.clientEmailInput.addEventListener('input', (e) => { state.client.email = e.target.value; renderPreview(); saveToLocalStorage(); });
    elements.clientAddressInput.addEventListener('input', (e) => { state.client.address = e.target.value; renderPreview(); saveToLocalStorage(); });

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

  // Set Document Type (Invoice vs Quotation vs Receipt)
  function setDocType(type) {
    state.docType = type;

    // Reset button states
    elements.btnInvoiceType.classList.remove('active');
    elements.btnQuotationType.classList.remove('active');
    if (elements.btnReceiptType) elements.btnReceiptType.classList.remove('active');

    if (type === 'invoice') {
      elements.btnInvoiceType.classList.add('active');
      if (state.docNumber.startsWith('QTN') || state.docNumber.startsWith('REC')) {
        state.docNumber = state.docNumber.replace(/^(QTN|REC)/, 'INV');
        elements.docNumberInput.value = state.docNumber;
      }
      elements.dueDateLabel.textContent = 'Due Date';
      if (elements.receiptDetailsSection) elements.receiptDetailsSection.style.display = 'none';
    } else if (type === 'quotation') {
      elements.btnQuotationType.classList.add('active');
      if (state.docNumber.startsWith('INV') || state.docNumber.startsWith('REC')) {
        state.docNumber = state.docNumber.replace(/^(INV|REC)/, 'QTN');
        elements.docNumberInput.value = state.docNumber;
      }
      elements.dueDateLabel.textContent = 'Valid Until';
      if (elements.receiptDetailsSection) elements.receiptDetailsSection.style.display = 'none';
    } else if (type === 'receipt') {
      if (elements.btnReceiptType) elements.btnReceiptType.classList.add('active');
      if (state.docNumber.startsWith('INV') || state.docNumber.startsWith('QTN')) {
        state.docNumber = state.docNumber.replace(/^(INV|QTN)/, 'REC');
        elements.docNumberInput.value = state.docNumber;
      }
      elements.dueDateLabel.textContent = 'Receipt Date';
      if (elements.receiptDetailsSection) elements.receiptDetailsSection.style.display = 'block';
    }

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
        description: product.description,
        quantity: 1,
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
      name: 'Custom Product / Service',
      description: 'Enter description here...',
      quantity: 1,
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
          <textarea class="form-control item-desc-input" style="margin-top: 4px;" placeholder="Description">${escapeHtml(item.description)}</textarea>
        </td>
        <td style="width: 80px;">
          <input type="number" class="form-control item-qty-input" value="${item.quantity}" min="1" step="1">
        </td>
        <td style="width: 120px;">
          <input type="number" class="form-control item-price-input" value="${item.price}" min="0" step="10">
        </td>
        <td style="width: 110px; font-weight: 700; font-family: var(--font-mono); vertical-align: middle;" class="item-total-cell">
          ${state.currency}${itemTotal.toLocaleString('en-IN')}
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
        totalCell.textContent = `${state.currency}${(q * p).toLocaleString('en-IN')}`;
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
    elements.currencySelect.value = state.currency;
    elements.docNumberInput.value = state.docNumber;
    elements.issueDateInput.value = state.issueDate;
    elements.dueDateInput.value = state.dueDate;

    if (elements.bankAccountSelect) elements.bankAccountSelect.value = state.bankAccountType || 'business';
    if (elements.customBankDetailsInput) elements.customBankDetailsInput.value = state.customBankDetails || '';
    if (elements.customBankInputs) {
      elements.customBankInputs.style.display = state.bankAccountType === 'custom' ? 'block' : 'none';
    }

    if (elements.toggleTaxesSection) elements.toggleTaxesSection.checked = state.enableTaxesSection !== false;
    if (elements.taxesControlsGrid) elements.taxesControlsGrid.style.display = state.enableTaxesSection !== false ? 'grid' : 'none';

    if (elements.toggleGstCheckbox) {
      elements.toggleGstCheckbox.checked = state.enableGst !== false;
      elements.taxRateInput.disabled = state.enableGst === false;
    }

    if (elements.toggleNotesSection) elements.toggleNotesSection.checked = state.enableNotesSection !== false;
    if (elements.notesControlsGrid) elements.notesControlsGrid.style.display = state.enableNotesSection !== false ? 'grid' : 'none';

    if (elements.paymentModeSelect) elements.paymentModeSelect.value = state.receipt.paymentMode;
    if (elements.transactionIdInput) elements.transactionIdInput.value = state.receipt.transactionId;
    if (elements.amountPaidInput) elements.amountPaidInput.value = state.receipt.amountPaid;
    if (elements.paymentDateInput) elements.paymentDateInput.value = state.receipt.paymentDate;

    elements.clientNameInput.value = state.client.name;
    elements.clientPhoneInput.value = state.client.phone;
    elements.clientEmailInput.value = state.client.email;
    elements.clientAddressInput.value = state.client.address;

    elements.discountTypeSelect.value = state.discountType;
    elements.discountValueInput.value = state.discountValue;
    elements.taxRateInput.value = state.taxRate;
    elements.shippingFeeInput.value = state.shippingFee;

    elements.notesInput.value = state.notes;
    elements.termsInput.value = state.terms;

    setDocType(state.docType);
    renderEditorItems();
  }

  // Render Live Preview PDF Sheet
  function renderPreview() {
    // Header Info
    const docTitleStr = state.docType === 'receipt' ? 'RECEIPT' : state.docType.toUpperCase();
    elements.previewDocTitle.textContent = docTitleStr;
    elements.previewDocNumber.textContent = `# ${state.docNumber}`;
    elements.previewIssueDateLabel.textContent = state.docType === 'invoice' ? 'Date Issued:' : state.docType === 'quotation' ? 'Quotation Date:' : 'Receipt Date:';
    elements.previewIssueDate.textContent = formatDate(state.issueDate);
    elements.previewDueDateLabel.textContent = state.docType === 'invoice' ? 'Due Date:' : state.docType === 'quotation' ? 'Valid Until:' : 'Payment Date:';
    elements.previewDueDate.textContent = formatDate(state.dueDate);

    // Client Info
    elements.previewClientName.textContent = state.client.name || 'Client Name';
    elements.previewClientPhone.textContent = state.client.phone ? `Phone: ${state.client.phone}` : '';
    elements.previewClientEmail.textContent = state.client.email ? `Email: ${state.client.email}` : '';
    elements.previewClientAddress.textContent = state.client.address || '';

    // Company Info
    elements.previewCompanyAddress.textContent = state.company.address;
    elements.previewCompanyPhoneEmail.textContent = `Phone: ${state.company.phone} | Email: ${state.company.email}`;
    elements.previewCompanyTaxId.textContent = `${state.company.taxId} | ${state.company.website}`;

    // Table Rows
    elements.previewItemsTableBody.innerHTML = '';
    let subtotal = 0;

    state.items.forEach((item, i) => {
      const lineTotal = item.quantity * item.price;
      subtotal += lineTotal;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="center" style="width: 35px;">${i + 1}</td>
        <td>
          <div class="pdf-item-title">${escapeHtml(item.name)}</div>
          ${item.description ? `<div class="pdf-item-desc">${escapeHtml(item.description)}</div>` : ''}
        </td>
        <td class="center" style="width: 60px;">${item.quantity}</td>
        <td class="num" style="width: 100px;">${state.currency}${item.price.toLocaleString('en-IN')}</td>
        <td class="num" style="width: 110px;">${state.currency}${lineTotal.toLocaleString('en-IN')}</td>
      `;
      elements.previewItemsTableBody.appendChild(tr);
    });

    // Financial Calculations
    let discountAmount = 0;
    let taxAmount = 0;
    let grandTotal = subtotal;

    if (state.enableTaxesSection !== false) {
      if (state.discountType === 'percentage') {
        discountAmount = (subtotal * state.discountValue) / 100;
      } else {
        discountAmount = state.discountValue;
      }
      const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount);

      if (state.enableGst !== false) {
        taxAmount = (subtotalAfterDiscount * state.taxRate) / 100;
      }

      grandTotal = Math.round(subtotalAfterDiscount + taxAmount + (state.shippingFee || 0));
    }

    const amountPaid = state.receipt.amountPaid || 0;
    const balanceDue = Math.max(0, grandTotal - amountPaid);

    // Update Summary UI
    elements.previewSubtotal.textContent = `${state.currency}${subtotal.toLocaleString('en-IN')}`;

    if (state.enableTaxesSection !== false && discountAmount > 0) {
      elements.previewDiscountRow.style.display = 'table-row';
      elements.previewDiscountLabel.textContent = state.discountType === 'percentage' ? `Discount (${state.discountValue}%):` : 'Discount:';
      elements.previewDiscountVal.textContent = `-${state.currency}${discountAmount.toLocaleString('en-IN')}`;
    } else {
      elements.previewDiscountRow.style.display = 'none';
    }

    if (state.enableTaxesSection !== false && state.enableGst !== false && state.taxRate > 0) {
      elements.previewTaxRow.style.display = 'table-row';
      elements.previewTaxLabel.textContent = `Tax / GST (${state.taxRate}%):`;
      elements.previewTaxVal.textContent = `+${state.currency}${taxAmount.toLocaleString('en-IN')}`;
    } else {
      elements.previewTaxRow.style.display = 'none';
    }

    if (state.enableTaxesSection !== false && state.shippingFee > 0) {
      elements.previewShippingRow.style.display = 'table-row';
      elements.previewShippingVal.textContent = `+${state.currency}${state.shippingFee.toLocaleString('en-IN')}`;
    } else {
      elements.previewShippingRow.style.display = 'none';
    }

    elements.previewGrandTotal.textContent = `${state.currency}${grandTotal.toLocaleString('en-IN')}`;

    // Bank Account Display logic
    if (elements.previewBankBlock) {
      if (state.bankAccountType === 'hide') {
        elements.previewBankBlock.style.display = 'none';
      } else {
        elements.previewBankBlock.style.display = 'block';
        if (state.bankAccountType === 'upi') {
          elements.previewBankText.innerHTML = 
            `Payment Method: UPI / GPay / PhonePe<br>` +
            `UPI ID: 9606076606@upi<br>` +
            `GPay / PhonePe: +91 96060 76606`;
        } else if (state.bankAccountType === 'custom') {
          elements.previewBankText.innerHTML = escapeHtml(state.customBankDetails || '').replace(/\n/g, '<br>');
        } else {
          // business (default)
          elements.previewBankText.innerHTML = 
            `Bank Name: HDFC Bank<br>` +
            `Account Name: HERITAGE 3D SOLUTIONS<br>` +
            `Account No: 50200012345678 | IFSC: HDFC0001234`;
        }
      }
    }

    // Receipt and Payment Details in Preview
    if (state.docType === 'receipt') {
      if (elements.previewPaymentModeRow) {
        elements.previewPaymentModeRow.style.display = 'table-row';
        elements.previewPaymentModeVal.textContent = state.receipt.paymentMode || 'N/A';
      }
      if (elements.previewTransactionRow) {
        elements.previewTransactionRow.style.display = 'table-row';
        elements.previewTransactionVal.textContent = state.receipt.transactionId || 'N/A';
      }
      if (elements.previewAmountPaidRow) {
        elements.previewAmountPaidRow.style.display = 'table-row';
        elements.previewAmountPaidVal.textContent = `${state.currency}${amountPaid.toLocaleString('en-IN')}`;
      }
      if (elements.previewBalanceDueRow) {
        elements.previewBalanceDueRow.style.display = 'table-row';
        elements.previewBalanceDueVal.textContent = `${state.currency}${balanceDue.toLocaleString('en-IN')}`;
      }

      // Status Badge Calculation
      if (balanceDue <= 0) {
        elements.previewStatusVal.textContent = 'PAID';
        elements.previewStatusVal.style.color = '#25d366';
      } else if (amountPaid > 0) {
        elements.previewStatusVal.textContent = 'PARTIALLY PAID';
        elements.previewStatusVal.style.color = '#f59e0b';
      } else {
        elements.previewStatusVal.textContent = 'UNPAID';
        elements.previewStatusVal.style.color = '#d90429';
      }
    } else {
      if (elements.previewPaymentModeRow) elements.previewPaymentModeRow.style.display = 'none';
      if (elements.previewTransactionRow) elements.previewTransactionRow.style.display = 'none';
      if (elements.previewAmountPaidRow) elements.previewAmountPaidRow.style.display = 'none';
      if (elements.previewBalanceDueRow) elements.previewBalanceDueRow.style.display = 'none';

      elements.previewStatusVal.textContent = state.docType === 'invoice' ? 'PENDING' : 'QUOTATION';
      elements.previewStatusVal.style.color = state.docType === 'invoice' ? '#d90429' : '#0284c7';
    }

    // Notes & Terms Toggles
    if (elements.previewNotesBlock) {
      elements.previewNotesBlock.style.display = state.enableNotesSection !== false ? 'block' : 'none';
    }
    if (elements.previewTermsBlock) {
      elements.previewTermsBlock.style.display = state.enableNotesSection !== false ? 'block' : 'none';
    }

    elements.previewNotes.innerHTML = state.notes ? escapeHtml(state.notes).replace(/\n/g, '<br>') : '';
    elements.previewTerms.innerHTML = state.terms ? escapeHtml(state.terms).replace(/\n/g, '<br>') : '';
  }

  // Export PDF using html2canvas & jsPDF direct 1:1 image fitting (Guaranteed 1 single A4 page, 0 clipping)
  async function downloadPdf() {
    const sheet = document.getElementById('pdfDocSheet');
    if (!sheet) return;

    const safeDocNum = (state.docNumber || 'DOC-001').replace(/[^a-zA-Z0-9_-]/g, '_');
    const defaultFilename = `${state.company.name}_${state.docType.toUpperCase()}_${safeDocNum}.pdf`;

    // Ask user for custom PDF filename
    const userChosenName = prompt("Enter filename for your PDF document:", defaultFilename);

    if (userChosenName === null) {
      return;
    }

    let filename = userChosenName.trim();
    if (!filename) {
      filename = defaultFilename;
    }

    if (!filename.toLowerCase().endsWith('.pdf')) {
      filename += '.pdf';
    }

    showToast(`Generating ${filename}...`, 'info');

    try {
      // 1. Capture exact canvas image of the PDF sheet using html2canvas
      const canvas = await html2canvas(sheet, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: 0
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);

      // 2. Initialize jsPDF A4 document (210mm x 297mm)
      const jsPDFConstructor = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
      if (!jsPDFConstructor) {
        throw new Error('jsPDF library not loaded');
      }

      const pdf = new jsPDFConstructor({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // 3. Add image mapped 1:1 to fill exactly (0, 0, 210mm, 297mm)
      // This guarantees 1 page, 0 right clipping, 0 left shift, 0 overflow!
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);

      // 4. Output binary blob with explicit application/pdf MIME type
      const pdfBlob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(pdfBlob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
      showToast(`Downloaded: ${filename}`, 'success');

    } catch (err) {
      console.error('PDF export error:', err);
      showToast('Export failed, opening print dialog...', 'info');
      window.print();
    }
  }

  // Direct WhatsApp Sharing
  function shareViaWhatsApp() {
    let rawPhone = state.client.phone || '';
    let cleanPhone = rawPhone.replace(/\D/g, '');

    if (!cleanPhone) {
      alert('Please enter a valid client WhatsApp / Phone number first.');
      return;
    }

    if (cleanPhone.length === 10) {
      cleanPhone = '91' + cleanPhone;
    }

    let subtotal = state.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    let discountAmount = state.discountType === 'percentage' ? (subtotal * state.discountValue) / 100 : state.discountValue;
    let afterDiscount = Math.max(0, subtotal - discountAmount);
    let taxAmount = (state.enableGst !== false) ? (afterDiscount * state.taxRate) / 100 : 0;
    let grandTotal = Math.round(afterDiscount + taxAmount + (state.shippingFee || 0));

    const typeUpper = state.docType.toUpperCase();

    let extraReceiptText = '';
    if (state.docType === 'receipt') {
      extraReceiptText = `\n💳 *Payment Method:* ${state.receipt.paymentMode}\n📑 *UTR / Txn ID:* ${state.receipt.transactionId}\n✅ *Amount Received:* ${state.currency}${state.receipt.amountPaid.toLocaleString('en-IN')}\n`;
    }

    const message = 
`Hello *${state.client.name}*,

Here is your official *${typeUpper}* from *${state.company.name}*.

📄 *Document:* ${typeUpper} #${state.docNumber}
📅 *Date:* ${formatDate(state.issueDate)}
💰 *Total Amount:* ${state.currency}${grandTotal.toLocaleString('en-IN')}${extraReceiptText}

Please find the generated PDF document attached.

Thank you!
*${state.company.name} - ${state.company.subtext}*
Phone: ${state.company.phone}`;

    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    
    window.open(waUrl, '_blank');
    showToast('WhatsApp opened! Download PDF and attach it to the chat.', 'success');
  }

  // Reset to default sample data
  function resetToDefaultData() {
    if (confirm('Reset form data to default example?')) {
      localStorage.removeItem('heritage_crm_pdf_state');
      location.reload();
    }
  }

  // Helpers & LocalStorage
  function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
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
      localStorage.setItem('heritage_crm_pdf_state', JSON.stringify(state));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }

  function loadFromLocalStorage() {
    try {
      const saved = localStorage.getItem('heritage_crm_pdf_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        Object.assign(state, parsed);
      }
      state.currency = '₹'; // Always enforce Indian Rupees (INR)
    } catch (e) {
      console.warn('LocalStorage load failed', e);
    }
  }

  // Run App
  init();
});
