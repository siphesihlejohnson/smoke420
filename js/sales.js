'use strict';

const Sales = (() => {
  let _payMethod = 'CASH';
  let _selectedProduct = null;

  function render(container) {
    _payMethod = 'CASH';
    _selectedProduct = null;
    const products = Data.getActiveProducts();
    const s = Auth.getSession();

    container.innerHTML = `
      <div class="content-inner">
        ${UI.panel('CAPTURE SALE', `
          <div class="sale-form">
            <div class="form-row">
              <div class="form-group">
                <label>CUSTOMER PHONE</label>
                <div class="input-with-btn">
                  <input type="tel" id="s-phone" maxlength="10" placeholder="0821234567" autocomplete="off">
                  <button class="btn btn-sm" id="btn-lookup">LOOKUP</button>
                </div>
              </div>
              <div class="form-group" id="cust-info-box" style="display:none">
                <label>CUSTOMER INFO</label>
                <div class="cust-info" id="cust-info"></div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>CUSTOMER NAME</label>
                <input type="text" id="s-name" placeholder="Enter name" autocomplete="off">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group flex-2">
                <label>PRODUCT</label>
                <select id="s-product">
                  <option value="">-- SELECT PRODUCT --</option>
                  ${products.map(p => `<option value="${p.id}">${UI.esc(p.name)} — ${Data.getSettings().currency||'R'}${p.price}/${p.unit} (${p.stock} in stock)</option>`).join('')}
                </select>
              </div>
              <div class="form-group">
                <label>UNIT</label>
                <input type="text" id="s-unit" readonly placeholder="—">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>QTY</label>
                <input type="number" id="s-qty" min="0.1" step="0.1" value="1">
              </div>
              <div class="form-group">
                <label>PRICE / UNIT</label>
                <input type="number" id="s-price" min="0" step="0.01">
              </div>
              <div class="form-group">
                <label>TOTAL</label>
                <input type="text" id="s-total" readonly placeholder="R0">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>PAYMENT METHOD</label>
                <div class="pay-toggle">
                  <button class="pay-btn active" id="btn-cash" data-method="CASH">CASH</button>
                  <button class="pay-btn" id="btn-eft" data-method="EFT">EFT</button>
                </div>
              </div>
            </div>
            <div class="form-actions">
              <button class="btn btn-primary btn-large" id="btn-confirm-sale">CONFIRM SALE [ENTER]</button>
              <button class="btn btn-secondary" id="btn-clear-sale">CLEAR</button>
            </div>
          </div>
        `)}
        <div id="own-sales-panel"></div>
      </div>
    `;

    // Bind events
    document.getElementById('btn-lookup').addEventListener('click', doLookup);
    document.getElementById('s-phone').addEventListener('keydown', e => { if (e.key === 'Enter') doLookup(); });
    document.getElementById('s-phone').addEventListener('input', () => {
      document.getElementById('cust-info-box').style.display = 'none';
    });
    document.getElementById('s-product').addEventListener('change', onProductChange);
    document.getElementById('s-qty').addEventListener('input', updateTotal);
    document.getElementById('s-price').addEventListener('input', updateTotal);
    document.getElementById('btn-cash').addEventListener('click', () => setPayment('CASH'));
    document.getElementById('btn-eft').addEventListener('click', () => setPayment('EFT'));
    document.getElementById('btn-confirm-sale').addEventListener('click', confirmSale);
    document.getElementById('btn-clear-sale').addEventListener('click', clearForm);

    document.addEventListener('keydown', _enterHandler);

    renderOwnSales();
  }

  function _enterHandler(e) {
    if (e.key === 'Enter' && App.currentTab === 'sale') {
      const active = document.activeElement;
      if (active && (active.id === 'btn-confirm-sale' || active.tagName === 'BUTTON')) return;
      confirmSale();
    }
  }

  function doLookup() {
    const phone = document.getElementById('s-phone').value.trim();
    if (!phone) return;
    const customer = Data.getCustomerByPhone(phone);
    const infoBox = document.getElementById('cust-info-box');
    const info = document.getElementById('cust-info');
    const nameEl = document.getElementById('s-name');

    if (customer) {
      nameEl.value = customer.name;
      infoBox.style.display = '';
      info.innerHTML = `
        <div class="cust-found">
          <span class="cust-tag found">EXISTING CUSTOMER</span>
          <strong>${UI.esc(customer.name)}</strong><br>
          Visits: ${customer.visits || 0} &nbsp;|&nbsp; Spent: ${UI.fmtCurrency(customer.totalSpent || 0)}<br>
          ${customer.favProduct ? `Fav: ${UI.esc(customer.favProduct)}<br>` : ''}
          ${customer.lastPurchase ? `Last: ${Data.fmtDate(customer.lastPurchase)}` : ''}
        </div>
      `;
    } else if (phone) {
      infoBox.style.display = '';
      info.innerHTML = `<span class="cust-tag new">NEW CUSTOMER — will be created on save</span>`;
      nameEl.focus();
    }
  }

  function onProductChange() {
    const id = document.getElementById('s-product').value;
    _selectedProduct = Data.getProductById(id);
    if (_selectedProduct) {
      document.getElementById('s-unit').value = _selectedProduct.unit;
      document.getElementById('s-price').value = _selectedProduct.price;
      document.getElementById('s-qty').value = '1';
    } else {
      document.getElementById('s-unit').value = '';
      document.getElementById('s-price').value = '';
    }
    updateTotal();
  }

  function updateTotal() {
    const qty = parseFloat(document.getElementById('s-qty').value) || 0;
    const price = parseFloat(document.getElementById('s-price').value) || 0;
    const total = qty * price;
    document.getElementById('s-total').value = UI.fmtCurrency(total);
  }

  function setPayment(method) {
    _payMethod = method;
    document.getElementById('btn-cash').classList.toggle('active', method === 'CASH');
    document.getElementById('btn-eft').classList.toggle('active', method === 'EFT');
  }

  async function confirmSale() {
    const phone  = document.getElementById('s-phone').value.trim();
    const name   = document.getElementById('s-name').value.trim();
    const prodId = document.getElementById('s-product').value;
    const qty    = parseFloat(document.getElementById('s-qty').value);
    const price  = parseFloat(document.getElementById('s-price').value);

    if (!prodId)        { UI.toast('Select a product', 'error'); return; }
    if (!qty || qty <= 0) { UI.toast('Enter a valid quantity', 'error'); return; }
    if (!price || price < 0) { UI.toast('Enter a valid price', 'error'); return; }
    if (!phone)         { UI.toast('Enter customer phone number', 'error'); return; }
    if (!name)          { UI.toast('Enter customer name', 'error'); return; }

    const product = Data.getProductById(prodId);
    if (!product) { UI.toast('Product not found', 'error'); return; }

    // Warn if stock would go negative
    if (product.unit === 'each' && qty > product.stock) {
      const go = await UI.confirm(`Stock is ${product.stock} but selling ${qty}. Continue?`);
      if (!go) return;
    }

    const s = Auth.getSession();
    const now = new Date();
    const amount = Math.round(qty * price * 100) / 100;

    const sale = Data.addSale({
      date:      Data.fmtDate(now),
      time:      Data.fmtTime(now),
      product:   product.name,
      productId: product.id,
      category:  product.category,
      unit:      product.unit,
      qty,
      amount,
      payment:   _payMethod,
      customer:  name,
      phone,
      staff:     s.staffName,
    });

    Data.deductStock(prodId, qty);

    const existing = Data.getCustomerByPhone(phone);
    if (existing) {
      Data.updateCustomerAfterSale(phone, name, amount, product.name);
    } else {
      Data.createCustomerFromSale(phone, name, s.staffId);
      Data.updateCustomerAfterSale(phone, name, amount, product.name);
    }

    Data.addAudit('SALE_CAPTURED',
      `${product.name} x${qty} — ${UI.fmtCurrency(amount)} (${_payMethod}) — ${name} (${phone})`,
      s.staffId);

    UI.toast(`Sale saved: ${product.name} x${qty} — ${UI.fmtCurrency(amount)}`, 'success');
    clearForm();
    renderOwnSales();
    Data.processQueue();
  }

  function clearForm() {
    document.getElementById('s-phone').value = '';
    document.getElementById('s-name').value = '';
    document.getElementById('s-product').value = '';
    document.getElementById('s-unit').value = '';
    document.getElementById('s-qty').value = '1';
    document.getElementById('s-price').value = '';
    document.getElementById('s-total').value = '';
    document.getElementById('cust-info-box').style.display = 'none';
    _selectedProduct = null;
    _payMethod = 'CASH';
    document.getElementById('btn-cash').classList.add('active');
    document.getElementById('btn-eft').classList.remove('active');
    document.getElementById('s-phone').focus();
  }

  function renderOwnSales() {
    const panel = document.getElementById('own-sales-panel');
    if (!panel) return;
    const s = Auth.getSession();
    const sales = Data.getSalesByStaff(s.staffName).slice().reverse().slice(0, 20);

    panel.innerHTML = UI.panel('MY RECENT SALES', UI.table(
      ['DATE', 'TIME', 'PRODUCT', 'QTY', 'CUSTOMER', 'PAY', 'AMOUNT'],
      sales.map(s => [s.date, s.time, UI.esc(s.product), s.qty, UI.esc(s.customer), s.payment, UI.fmtCurrency(s.amount)]),
      'No sales recorded yet'
    ));
  }

  return { render };
})();

// ─── Sales Log ────────────────────────────────────────────────────────────────
const SalesLog = (() => {
  function render(container) {
    const s = Auth.getSession();
    const isAdmin = s?.role === 'admin';
    const allSales = isAdmin ? Data.getSales() : Data.getSalesByStaff(s.staffName);
    const staff = Data.getStaff();

    const months = [...new Set(allSales.map(s => s.date?.slice(3)))].filter(Boolean).sort().reverse();
    const products = [...new Set(allSales.map(s => s.product))].filter(Boolean).sort();

    container.innerHTML = `
      <div class="content-inner">
        ${UI.panel('SALES LOG', `
          <div class="filter-row">
            <div class="form-group">
              <label>MONTH</label>
              <select id="log-month">
                <option value="">ALL</option>
                ${months.map(m => `<option value="${m}">${m}</option>`).join('')}
              </select>
            </div>
            ${isAdmin ? `
            <div class="form-group">
              <label>STAFF</label>
              <select id="log-staff">
                <option value="">ALL</option>
                ${staff.map(sf => `<option value="${sf.name}">${sf.name}</option>`).join('')}
              </select>
            </div>` : ''}
            <div class="form-group">
              <label>PRODUCT</label>
              <select id="log-product">
                <option value="">ALL</option>
                ${products.map(p => `<option value="${UI.esc(p)}">${UI.esc(p)}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label>PAYMENT</label>
              <select id="log-pay">
                <option value="">ALL</option>
                <option value="CASH">CASH</option>
                <option value="EFT">EFT</option>
              </select>
            </div>
            <div class="form-group">
              <label>SEARCH</label>
              <input type="text" id="log-search" placeholder="Name or phone">
            </div>
            ${isAdmin ? `<button class="btn btn-sm" id="log-export">EXPORT CSV</button>` : ''}
          </div>
          <div id="log-table"></div>
          <div id="log-total" class="log-total"></div>
        `)}
      </div>
    `;

    function applyFilters() {
      const month   = document.getElementById('log-month')?.value || '';
      const staffF  = document.getElementById('log-staff')?.value || '';
      const product = document.getElementById('log-product')?.value || '';
      const pay     = document.getElementById('log-pay')?.value || '';
      const search  = document.getElementById('log-search')?.value.toLowerCase() || '';

      let filtered = [...allSales].reverse();
      if (month)   filtered = filtered.filter(s => s.date?.slice(3) === month);
      if (staffF)  filtered = filtered.filter(s => s.staff === staffF);
      if (product) filtered = filtered.filter(s => s.product === product);
      if (pay)     filtered = filtered.filter(s => s.payment === pay);
      if (search)  filtered = filtered.filter(s =>
        (s.customer||'').toLowerCase().includes(search) ||
        (s.phone||'').includes(search));

      const total = filtered.reduce((a, s) => a + (s.amount || 0), 0);
      const cash  = filtered.filter(s => s.payment === 'CASH').reduce((a,s) => a + s.amount, 0);
      const eft   = filtered.filter(s => s.payment === 'EFT').reduce((a,s) => a + s.amount, 0);

      document.getElementById('log-table').innerHTML = UI.table(
        isAdmin
          ? ['DATE','TIME','PRODUCT','QTY','UNIT','CUSTOMER','PHONE','PAY','AMOUNT','STAFF']
          : ['DATE','TIME','PRODUCT','QTY','CUSTOMER','PAY','AMOUNT'],
        filtered.map(s => isAdmin
          ? [s.date, s.time, UI.esc(s.product), s.qty, s.unit, UI.esc(s.customer), s.phone, s.payment, UI.fmtCurrency(s.amount), s.staff]
          : [s.date, s.time, UI.esc(s.product), s.qty, UI.esc(s.customer), s.payment, UI.fmtCurrency(s.amount)]
        ),
        'No sales match filter'
      );

      document.getElementById('log-total').innerHTML = `
        <span>TOTAL: <strong>${UI.fmtCurrency(total)}</strong></span>
        <span>CASH: <strong>${UI.fmtCurrency(cash)}</strong></span>
        <span>EFT: <strong>${UI.fmtCurrency(eft)}</strong></span>
        <span>RECORDS: <strong>${filtered.length}</strong></span>
      `;

      if (isAdmin) {
        document.getElementById('log-export')?.replaceWith(
          (() => {
            const btn = document.createElement('button');
            btn.className = 'btn btn-sm';
            btn.id = 'log-export';
            btn.textContent = 'EXPORT CSV';
            btn.addEventListener('click', () => exportCSV(filtered));
            return btn;
          })()
        );
      }
    }

    ['log-month','log-staff','log-product','log-pay','log-search'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', applyFilters);
    });
    if (isAdmin) {
      document.getElementById('log-export')?.addEventListener('click', () => exportCSV(allSales));
    }

    applyFilters();
  }

  function exportCSV(sales) {
    const s = Auth.getSession();
    Data.addAudit('EXPORT_CSV', `Sales log exported (${sales.length} records)`, s?.staffId);
    const header = 'Date,Time,Product,Category,Unit,Qty,Amount,Payment,Customer,Phone,Staff,SaleID\n';
    const rows = sales.map(s =>
      [s.date,s.time,s.product,s.category,s.unit,s.qty,s.amount,s.payment,
       `"${s.customer||''}"`,s.phone,s.staff,s.id].join(',')
    ).join('\n');
    _download('sales_export.csv', header + rows);
  }

  function _download(filename, content) {
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(content);
    a.download = filename;
    a.click();
  }

  return { render };
})();
