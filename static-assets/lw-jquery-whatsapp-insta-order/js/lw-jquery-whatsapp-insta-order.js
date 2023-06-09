!(function (b) {
  "use strict";

  (b.whatsAppInstaOrder = function (t, e) {}),
    (b.whatsAppInstaOrder.defaultOptions = {
      dataUrl: "data-provider/products.json",
      siteBaseUrl: "",
      forceFresh: !1,
      storeName: "jQuery JSON - WhatsApp InstaOrder",
      logoImage: "",
      currencySymbol: "$",
      currency: "MAD",
      checkoutMethods: {
        orderByWhatsApp: {
          enable: !0,
          mobileNumber: "",
          orderTypes: {
            takeaway: {
              enable: !0,
              title: "Takeaway",
            },
            delivery: {
              enable: !0,
              title: "Delivery",
            },
            table: {
              enable: !0,
              title: "Table",
            },
          },
          title: "WhatsApp Order",
          method: "orderByWhatsApp",
          btnElement: {
            id: "#whatsappCheckout",
            class: "btn-success",
            title: 'Proceed to <i class="fab fa-whatsapp"></i> WhatsApp Order',
          },
        },
      },
      shippingCharges: 0,
      taxPercentage: 0,
      searchProductDetails: !0,
      searchProductIds: !0,
      searchCategoryIds: !0,
      perPageCount: 12,
    }),
    (b.fn.whatsAppInstaOrder = function (t) {
      (t = b.extend(!0, {}, b.whatsAppInstaOrder.defaultOptions, t)),
        new b.whatsAppInstaOrder(this, t),
        (_.templateSettings.variable = "_oData");
      var c = t,
        u = {},
        a = {},
        d = {},
        o = {},
        s = {},
        n = new Array(),
        i = {},
        l = {},
        p = !1,
        m = {
          isStoreLoaded: !1,
          lastAccessedCategory: null,
          hashChanged: !1,
          preventHashChangedAction: !1,
          cartStorageName: "lw-store-cart-storage-" + window.location.hostname,
          qtyUpdateTimeout: null,
          searchDelayTimeout: null,
          showSubmitOrderTimeout: null,
          enableOrderBtn: !1,
          preventHashChange: !1,
          initialBreadcrumb:
            '<li class="breadcrumb-item"><a data-categoryindex="all" href="#/category/uid-all" class="category-link-all category-link">جميع الأصناف</a></li>',
          parentCategoriesString: "",
          currentPaginate: 20,
          previousPaginate: 0,
          perPageCount: c.perPageCount || 10,
          totalCount: 0,
          orderType: null,
        },
        h = 0,
        g = 0,
        C = {
          storeLogo: b("#storeLogo"),
          checkoutSubmitOrderBtn: b("#checkoutSubmitOrder"),
          loaderContainer: b("#loaderContainer"),
          mainContainer: b("#mainContainer"),
          modalCommon: b("#commonModal"),
          modalContainer: b(".common-modal-content"),
          categoriesList: b("#categoriesList"),
          storeLoaderStatusText: b(".lw-loading-status"),
          productsContainer: b("#productsContainer"),
          masonryProductsContainer: null,
          storeWaitingText: b(".lw-waiting-text"),
          addToCartBtnContainer: b("#addToCartBtnContainer"),
          productsBreadcrumb: b("#productsBreadcrumb"),
          shoppingCartBtnContainer: b(".shopping-cart-btn-container"),
          searchInput: b("input.search-product"),
          clearSearchBtn: b(".clear-search-result-btn"),
          footerStoreName: b(".footer-store-name"),
          goToTop: b(".go-to-top"),
          searchedProductCounts: b("#searchedProductCounts"),
        },
        f = {
          sidebarCategories: _.template(
            b("script.sidebar-categories-template").html()
          ),
          productsGrid: _.template(b("script.products-grid-template").html()),
          productsDetailsModal: _.template(
            b("script.products-details-modal-template").html()
          ),
          productsOptionsPopover: _.template(
            b("script.product-options-popover-template").html()
          ),
          shoppingCartModal: _.template(
            b("script.shopping-cart-template").html()
          ),
          whatsAppOrderTemplate: _.template(
            b("script.whatsapp-order-template").html()
          ),
          addToCartBtn: _.template(b("script.add-to-cart-btn-template").html()),
          shoppingCartBtn: _.template(
            b("script.shopping-cart-btn-template").html()
          ),
          submitOrderFormModal: _.template(
            b("script.submit-order-form-template").html()
          ),
        },
        y = {
          objectLength: function (t) {
            return _.allKeys(t).length;
          },
          formatAmount: function (t) {
            return `${new Number(t).toFixed(2)} ${c.currencySymbol}`;
          },
          fullFormatAmount: function (t) {
            return `${c.currency} ${new Number(t).toFixed(2)} ${
              c.currencySymbol
            }`;
          },
          sanitizeDetails: function (t) {
            return t ? t.replace(/(<([^>]+)>)/gi, "") : "";
          },
          convertToSlug: function (t) {
            return t
              .toLowerCase()
              .replace(/ /g, "-")
              .replace(/[^\w-]+/g, "");
          },
          queryToObject: function (t) {
            if (_.isString(t)) {
              for (
                var e = t.replace("?", "&").split("&"),
                  r = {},
                  a = 0,
                  o = e.length;
                a < o;
                a++
              ) {
                var n = e[a].split("=");
                r[decodeURIComponent(n[0])] = decodeURIComponent(n[1]);
              }
              return r;
            }
            return t;
          },
          dataFromURL: function () {
            return _.object(
              _.compact(
                _.map(location.hash.slice(1).split("/"), function (t) {
                  if (t) return t.split("id-");
                })
              )
            );
          },
          goToTop: function (t) {
            t && t.preventDefault(),
              b("html, body").animate(
                {
                  scrollTop: "0px",
                },
                {
                  duration: 200,
                  easing: "swing",
                }
              );
          },
          resizeNPosition: function () {},
          uniqueIdGeneration: function (t) {
            var e = new Date();
            return (
              e.getFullYear() +
              (e.getMonth() + 1 < 10
                ? "0" + (e.getMonth() + 1)
                : e.getMonth() + 1) +
              (e.getDate() < 10 ? "0" + e.getDate() : e.getDate()) +
              +(e.getHours() < 10 ? "0" + e.getHours() : e.getHours()) +
              "#" +
              Math.random().toString(36).substr(2, 4)
            );
          },
        };
      y.resizeNPosition(),
        _.delay(function () {
          y.resizeNPosition();
        }, 300),
        C.storeLoaderStatusText.html("Loading ...");
      t = new Date();
      b.ajax({
        type: "GET",
        url: c.dataUrl + (!0 === c.forceFresh ? "?file=" + t.getTime() : ""),
        dataType: "JSON",
        success: function (t) {
          b("#mainContainer").show(),
            C.storeLoaderStatusText.html("Initializing ...");
          t = t.categories;
          v.prepareJSONProductsData(t), v.loadExistingCartItems();
        },
      }).fail(function (t, e) {
        v.showErrorMessage(
          "Oooops... Failed to load Products data!!",
          t.statusText + " : " + e
        );
      });
      var v = {
        showErrorMessage: function (t, e) {
          C.storeWaitingText.html(t),
            C.loaderContainer
              .find(".preloader")
              .removeClass("preloader")
              .addClass("lw-broken-file-link")
              .text(""),
            e &&
              C.storeLoaderStatusText
                .html("<small>" + e + "</small>")
                .addClass("text-danger");
        },
        prepareJSONProductsData: function (t, l, r) {
          (r = r || 1),
            _.each(t, function (t) {
              var e = t.name,
                s = t.id ? y.convertToSlug(t.id) : h;
              if (a[s])
                throw (
                  (v.showErrorMessage("ERROR!!", "Duplicate Category ID " + s),
                  "Duplicate Category ID " + s)
                );
              (a[s] = {
                name: e,
                index: s,
                parentLevel: r,
                parentCategoryIndex: l,
                slug: y.convertToSlug(e),
              }),
                _.each(t.products, function (t) {
                  if (t.active) {
                    var e = parseFloat(t.old_price),
                      r = parseFloat(t.additional_shipping_charge),
                      a = parseFloat(t.tax_percentage),
                      o = t.name,
                      n = t.id ? y.convertToSlug(t.id) : g,
                      i = parseFloat(t.price);
                    if (u[n])
                      throw (
                        (v.showErrorMessage(
                          "ERROR!!",
                          "Duplicate Product ID " + n
                        ),
                        "Duplicate Product ID " + n)
                      );
                    var d = (u[n] = {
                      name: o,
                      slug: y.convertToSlug(o),
                      thumbPath: t.thumbnail_path,
                      detailsLink: t.details_link || null,
                      price: i,
                      outOfStock: t.out_of_stock || !1,
                      formattedPrice: y.formatAmount(i),
                      fullFormattedPrice: y.fullFormatAmount(i),
                      oldPrice: e
                        ? {
                            fullFormatted: y.fullFormatAmount(e),
                            formatted: y.formatAmount(e),
                            price: e,
                          }
                        : null,
                      additionalShippingCharge: _.isNumber(r) ? r : 0,
                      taxPercentage: _.isNumber(a) ? a : 0,
                      id: t.id,
                      index: n,
                      categoryIndex: s,
                      parentCategoryIndex: l,
                      details: t.details,
                      sanitizedDetails: y.sanitizeDetails(t.details),
                      productOptions: [],
                      hasAddonPrice: !1,
                      calculateTax: function (t, e) {
                        var r = 0,
                          r =
                            !this.taxPercentage && c.taxPercentage
                              ? ((this.price + t) * c.taxPercentage) / 100
                              : ((this.price + t) * this.taxPercentage) / 100;
                        return e ? e * r : r;
                      },
                      calculateShipping: function (t) {
                        return "delivery" !== m.orderType
                          ? 0
                          : t
                          ? t * this.additionalShippingCharge
                          : this.additionalShippingCharge;
                      },
                    });
                    _.each(t.options, function (t) {
                      var r = {
                        _id: s + "_" + n + "_" + y.convertToSlug(t.title),
                        title: t.title,
                        optionValues: [],
                      };
                      _.each(t.values, function (t) {
                        var e = _.isNumber(parseFloat(t.addon_price))
                          ? parseFloat(t.addon_price)
                          : 0;
                        0 < e && (d.hasAddonPrice = !0),
                          r.optionValues.push({
                            name: t.value_name,
                            addonPrice: e,
                            addonPriceFormatted: y.formatAmount(e),
                            value: t.value || t.value_name,
                          });
                      }),
                        (d.productOptions[r._id] = r);
                    }),
                      g++;
                  }
                }),
                t.categories &&
                  t.categories.length &&
                  v.prepareJSONProductsData(t.categories, s, r + 1),
                h++;
            });
        },
        setupCategories: function () {
          C.categoriesList.find(".active-category").after(
            f.sidebarCategories({
              categoriesCollection: a,
            })
          ),
            v.setupStore();
        },
        loadExistingCartItems: function () {
          var t = b.jStorage.get(m.cartStorageName),
            t = b.parseJSON(t);
          t && t.length && (n = t), v.updateCart(), v.setupCategories();
        },
        setupStore: function () {
          v.onAllComplete();
        },
        categoryLinkAction: function (t) {
          (m.preventHashChangedAction = !1),
            C.productsBreadcrumb.show(),
            b("body").removeClass("lw-sidebar-opened");
        },
        getParentCategories: function (t, e, r) {
          return (
            (e && e.length) || (e = []),
            a[t] &&
              (r ? e.push(a[t]) : e.push(a[t].parentCategoryIndex),
              v.getParentCategories(a[t].parentCategoryIndex, e, r)),
            e
          );
        },
        getChildCategories: function (t, e, r) {
          r = r || [];
          t = _.where(e, {
            parentCategoryIndex: t,
          });
          return (
            t &&
              _.each(t, function (t) {
                r.push(t.index), v.getChildCategories(t.index, e, r);
              }),
            r
          );
        },
        loadCategoryProducts: function (e) {
          v.clearSearchResult(!0);
          var r = v.getChildCategories(e, a);
          "all" == e
            ? ((d = u), v.updateBreadCrumb("all"))
            : ((d = _.filter(u, function (t) {
                if (t.categoryIndex == e || _.contains(r, t.categoryIndex))
                  return t;
              })),
              v.updateBreadCrumb(a[e])),
            y.goToTop(),
            C.categoriesList
              .find(".list-group-item")
              .removeClass("active-category active"),
            C.categoriesList
              .find(".category-list-item-" + e)
              .addClass("active-category active"),
            (m.lastAccessedCategory = e),
            v.generateProductsThumbs();
        },
        loadMoreItems: function (t) {
          t.preventDefault(),
            (m.previousPaginate = m.currentPaginate),
            (m.currentPaginate = m.currentPaginate + m.perPageCount),
            v.generateProductsThumbs(!0);
        },
        generateProductsThumbs: function (t) {
          t || ((m.currentPaginate = m.perPageCount), (m.previousPaginate = 0));
          t = _.size(d);
          m.currentPaginate >= t
            ? (b(".lw-result-loaded-text").html("عرض " + t + " من أصل " + t),
              b(".lw-load-more-content").hide())
            : (b(".lw-result-loaded-text").html(
                "عرض " + m.currentPaginate + " من أصل " + t
              ),
              b(".lw-load-more-content").show());
          var r = 0,
            t = _.filter(d, function (t, e) {
              if (++r > m.previousPaginate && r <= m.currentPaginate) return t;
            });
          0 == m.previousPaginate
            ? (C.productsContainer.data("masonry") &&
                (C.productsContainer.masonry("destroy"),
                (C.masonryProductsContainer = null)),
              (m.totalCount = _.toArray(d).length),
              C.productsContainer.html(
                f.productsGrid({
                  currentProductCollection: t,
                })
              ),
              (C.masonryProductsContainer = C.productsContainer.masonry({
                itemSelector: ".product-item",
                percentPosition: !0,
                horizontalOrder: !0,
                columnWidth: ".product-item",
                gutter: ".lw-gutter-sizer",
              })))
            : (C.productsContainer.append(
                f.productsGrid({
                  currentProductCollection: t,
                })
              ),
              C.masonryProductsContainer.masonry(
                "appended",
                b(".product-item-new")
              )),
            C.masonryProductsContainer.masonry(
              "once",
              "layoutComplete",
              function () {
                b(".product-item-new").removeClass("product-item-new");
              }
            ),
            d.length <= 0 && C.loaderContainer.hide(),
            b(".product-item-thumb-image").Lazy({
              afterLoad: function (t) {
                C.loaderContainer.hide(),
                  b(t).parents(".product-item").addClass("fade-in"),
                  C.masonryProductsContainer.masonry("layout"),
                  y.resizeNPosition();
              },
              onError: function (t) {
                C.loaderContainer.hide(),
                  b(t)
                    .parents(".thumb-holder")
                    .addClass("lw-image-broken")
                    .parents(".product-item")
                    .addClass("fade-in"),
                  C.masonryProductsContainer.masonry("layout"),
                  y.resizeNPosition();
              },
              effect: "fadeIn",
              effectTime: 0,
            }),
            b('.product-item [data-toggle="popover"]').popover({
              container: "#productsContainer",
              content: function () {
                return (
                  v.selectCurrentProduct(b(this).data("productindex")),
                  f.productsOptionsPopover({
                    oCurrentProductData: o,
                    fnMisc: y,
                    nProductInCart: p,
                  })
                );
              },
              sanitize: !1,
              html: !0,
            }),
            b('.product-item [data-toggle="popover"]').on(
              "shown.bs.popover",
              function () {
                v.updateAddToCartBtn();
              }
            ),
            b(document).on("click", function (t) {
              b(
                '.product-item [data-toggle="popover"],.product-item [data-original-title]'
              ).each(function () {
                b(this).is(t.target) ||
                  0 !== b(this).has(t.target).length ||
                  0 !== b(".popover").has(t.target).length ||
                  ((
                    (b(this).popover("hide").data("bs.popover") || {})
                      .inState || {}
                  ).click = !1);
              });
            });
        },
        onSearch: function () {
          clearTimeout(m.searchDelayTimeout),
            (m.searchDelayTimeout = setTimeout(function () {
              if ("" == C.searchInput.val()) return !1;
              if (
                (C.clearSearchBtn.removeAttr("disabled"),
                y.dataFromURL().hasOwnProperty("search"))
              ) {
                if (m.preventHashChangedAction)
                  return (m.preventHashChangedAction = !1);
                v.searchProduct();
              } else location.hash = "#/search";
            }, 300));
        },
        clearSearchResult: function (t) {
          C.searchInput.val(""),
            C.clearSearchBtn.attr("disabled", ""),
            C.searchedProductCounts.html(""),
            t || v.searchProduct();
        },
        searchProduct: function () {
          C.categoriesList
            .find(".list-group-item")
            .removeClass("active-category active");
          var t = C.searchInput.val().toLowerCase().split(" ");
          s = u;
          for (var e = [], r = 0; r < t.length; r++) {
            var a,
              o = t[r],
              e = [];
            for (a in s) {
              var n = s[a],
                i = n.name.toLowerCase();
              c.searchProductDetails && (i += n.details.toLowerCase()),
                c.searchProductIds && (i += n.index),
                c.searchCategoryIds && (i += n.categoryIndex),
                -1 < i.indexOf(o) && e.push(n);
            }
            s = e;
          }
          (m.lastAccessedCategory = "search"),
            C.productsBreadcrumb.hide(),
            C.searchedProductCounts.html(
              " تم العثور على " + s.length + " منتج"
            ),
            _.isEqual(d, s) || ((d = s), v.generateProductsThumbs(!1));
        },
        selectCurrentProduct: function (t) {
          if (!(o = u[t])) return !(location.hash = "#");
          if (((l = {}), 0 < y.objectLength(o.productOptions)))
            for (var e in o.productOptions) {
              e = o.productOptions[e];
              l[e._id] = {
                value: e.optionValues[0].value,
                name: e.optionValues[0].name,
                optionTitle: e.title,
              };
            }
          p = v.itemExistInCart();
        },
        productDetails: function (t) {
          v.selectCurrentProduct(t),
            C.modalContainer.html(
              f.productsDetailsModal({
                oCurrentProductData: o,
                fnMisc: y,
                categoriesCollection: a,
              })
            ),
            v.updateAddToCartBtn(),
            v.openModal();
        },
        showShoppingCart: function (t) {
          if (
            (C.modalContainer.html(
              f.shoppingCartModal({
                cartProductsCollection: n,
                allProductsCollection: u,
                configOptions: c,
                fnMisc: y,
                generalVars: m,
                cartStats: i,
              })
            ),
            t && t.preventModelReLoad)
          )
            return !1;
          v.openModal(),
            v.updateAddToCartBtn(),
            m.isStoreLoaded || v.loadCategoryProducts("all");
        },
        backFromModal: function () {
          if (
            (C.mainContainer.removeClass("main-container-additions"),
            m.preventHashChange)
          )
            return (m.preventHashChange = !1);
          (m.preventHashChangedAction = !0),
            "search" == m.lastAccessedCategory
              ? (location.hash = "#/search")
              : (location.hash = "#/category/uid-" + m.lastAccessedCategory);
        },
        updatedSelectedOption: function (t) {
          t.preventDefault();
          var t = b(this),
            e = t.find("option:selected").val(),
            r = t.data("id");
          return (
            0 < y.objectLength(o.productOptions[r].optionValues) &&
              _.each(o.productOptions[r].optionValues, function (t) {
                t.value == e &&
                  (l[r] = {
                    value: t.value,
                    name: t.name,
                    optionTitle: o.productOptions[r].title,
                  });
              }),
            v.updateAddToCartBtn()
          );
        },
        addToCartGridItem: function (t) {
          if ((t.preventDefault(), !o)) return !1;
          v.addToCart(
            t,
            parseInt(
              b(t.target).parents(".popover").find(".item-product-qty").val()
            )
          );
        },
        addToCart: function (t, e) {
          return (
            (e = e || parseInt(b(".modal .item-product-qty").val())),
            t && t.preventDefault(),
            v.itemExistInCart()
              ? e && n[m.nProductIndexInCart].qty != e
                ? (n[m.nProductIndexInCart].qty = e)
                : n[m.nProductIndexInCart].qty++
              : n.push({
                  index: o.index,
                  options: _.extend({}, l),
                  qty: e && _.isNumber(e) ? e : 1,
                }),
            v.updateCart(),
            v.updateAddToCartBtn()
          );
        },
        updateCart: function () {
          try {
            for (var t in ((i.totalItems = 0),
            (i.subTotal = 0),
            (i.totalTaxes = 0),
            (i.totalShippingCharges = 0),
            b.jStorage.set(m.cartStorageName, b.toJSON(n)),
            n)) {
              var e = n[t],
                r = u[e.index],
                a = 0;
              if (!r) {
                n = new Array();
                break;
              }
              _.isEmpty(e.options) ||
                _.each(e.options, function (t, e) {
                  t = _.findWhere(r.productOptions[e].optionValues, {
                    value: t.value,
                  });
                  t.addonPrice && (a += t.addonPrice);
                }),
                r.additionalShippingCharge &&
                  (i.totalShippingCharges += r.calculateShipping(e.qty)),
                (r.taxPercentage || c.taxPercentage) &&
                  (i.totalTaxes += r.calculateTax(a, e.qty)),
                (i.totalItems += e.qty),
                (i.subTotal += (r.price + a) * e.qty);
            }
            c.shippingCharges && (i.totalShippingCharges += c.shippingCharges),
              "delivery" !== m.orderType && (i.totalShippingCharges = 0),
              (i.amountFormatted = y.fullFormatAmount(i.subTotal)),
              (m.enableOrderBtn = !!(0 < n.length && m.orderType)),
              C.shoppingCartBtnContainer.html(
                f.shoppingCartBtn({
                  cartStats: i,
                })
              );
          } catch (t) {
            (n = new Array()),
              b.jStorage.set(m.cartStorageName, b.toJSON([])),
              v.updateCart();
          }
        },
        updateCartItemQty: function () {
          clearTimeout(m.qtyUpdateTimeout);
          var t = b(this),
            e = Math.ceil(new Number(t.val())),
            r = t.data("cartrowindex");
          if (e < 1) return t.val(1), !1;
          m.qtyUpdateTimeout = setTimeout(function () {
            (n[r].qty = e),
              v.updateCart(),
              v.showShoppingCart({
                preventModelReLoad: !0,
              });
          }, 300);
        },
        removeCartItem: function (t) {
          var e = b(this).data("cartrowindex");
          n.splice(e, 1),
            v.updateCart(),
            v.showShoppingCart({
              preventModelReLoad: !0,
            });
        },
        updateAddToCartBtn: function () {
          return (
            (C.addToCartBtnContainer = b("#addToCartBtnContainer")),
            (p = v.itemExistInCart()),
            b("#addToCartBtnContainer").html(
              f.addToCartBtn({
                nProductInCart: p,
              })
            ),
            b(
              "#productsContainer .item-product-qty, .modal .item-product-qty"
            ).val(p || 1),
            b(
              "#productsContainer .lw-popover-content .add-to-cart-btn-grid-item-save"
            ).text(p ? "تعديل" : "اضافة"),
            p
          );
        },
        itemExistInCart: function () {
          for (var t in ((m.nProductIndexInCart = !1), n)) {
            var e = n[t];
            if (e.index == o.index) {
              var r,
                a = 0;
              for (r in e.options) e.options[r].value == l[r].value && a++;
              if (a === y.objectLength(e.options))
                return (m.nProductIndexInCart = t), e.qty;
            }
          }
          return !1;
        },
        updateBreadCrumbOnOver: function () {
          var t = b(this).data("productindex"),
            t = u[t];
          C.productsBreadcrumb.html(
            m.parentCategoriesString +
              (t
                ? '  <li class="breadcrumb-item">' + t.name + "</li>"
                : "</li>")
          );
        },
        updateBreadCrumb: function (t, e) {
          var r = m.initialBreadcrumb;
          "all" == t
            ? C.productsBreadcrumb.html(r)
            : ((t = v.getParentCategories(t.index, null, !0)),
              _.each(t.reverse(), function (t) {
                r +=
                  '<li class="breadcrumb-item"><a data-categoryindex="all" href="#/category/uid-' +
                  t.index +
                  '" class="category-link-' +
                  t.index +
                  ' category-link">' +
                  t.name +
                  "</a></li>";
              })),
            (m.parentCategoriesString = r),
            C.productsBreadcrumb.html(r);
        },
        proceedToOrderByWhatsApp: function (t) {
          if (
            (t.preventDefault(), (m.preventHashChange = !0), !m.enableOrderBtn)
          )
            return !1;
          v.closeAllModals(),
            clearTimeout(m.showSubmitOrderTimeout),
            (m.showSubmitOrderTimeout = setTimeout(function () {
              C.modalContainer.html(
                f.submitOrderFormModal({
                  configOptions: c,
                })
              ),
                C.modalContainer.find(".lw-delivery-fields").hide(),
                C.modalContainer
                  .find(".lw-delivery-fields .required")
                  .removeAttr("required"),
                C.modalContainer
                  .find(".lw-delivery-field-" + m.orderType)
                  .show(),
                C.modalContainer
                  .find(".lw-delivery-field-" + m.orderType)
                  .attr("required", "required"),
                v.openModal(),
                b("#submitOrderForm").validate(),
                b(".required").on("keyup change", v.validateSubmitOrderForm);
            }, 500));
        },
        submitOrder: function (t) {
          if ((t.preventDefault(), !m.enableOrderBtn)) return !1;
          if (v.validateSubmitOrderForm()) {
            b(".lw-errors-container")
              .addClass("hidden")
              .find(".lw-error-*")
              .addClass("hidden"),
              (m.enableOrderBtn = !1);
            t =
              "whatsapp://send?abid=" +
              c.checkoutMethods.orderByWhatsApp.mobileNumber +
              "&text=";
            return (
              (t += encodeURIComponent(
                f.whatsAppOrderTemplate({
                  cartProductsCollection: n,
                  allProductsCollection: u,
                  configOptions: c,
                  fnMisc: y,
                  generalVars: m,
                  cartStats: i,
                  orderId: y.uniqueIdGeneration(),
                  selectedOrderType:
                    c.checkoutMethods.orderByWhatsApp.orderTypes[m.orderType]
                      .title,
                  formDetails: y.queryToObject(
                    b("#submitOrderForm").serialize()
                  ),
                })
              )),
              void (window.location.href = t)
            );
          }
          b(".error").first().focus();
        },
        onOrderSubmitted: function () {
          b(".order-page-header").html("Order Prepared for WhatsApp"),
            b(".order-page-body").html(
              "Thank you for your Order, <br/> Your order has been prepared, please Send it using your WhatsApp!!"
            ),
            b("#backToCartBtn, #submitOrderBtn").hide(),
            b(".order-page-close-btn").show(),
            (n = new Array()),
            v.updateCart();
        },
        validateSubmitOrderForm: function () {
          var t = b("#submitOrderForm").valid();
          return t
            ? b("#submitOrderBtn")
                .removeAttr("disabled")
                .removeClass("disabled")
            : b("#submitOrderBtn")
                .attr("disabled", "disabled")
                .addClass("disabled", "disabled");
        },
        backToCartFromSubmitForm: function (t) {
          t.preventDefault(),
            v.closeAllModals(),
            (m.preventHashChange = !0),
            clearTimeout(m.showSubmitOrderTimeout),
            (m.showSubmitOrderTimeout = setTimeout(function () {
              v.showShoppingCart({
                preventModelReLoad: !0,
              }),
                v.openModal();
            }, 500));
        },
        processCheckout: function (t) {
          if ((t.preventDefault(), !m.enableOrderBtn)) return !1;
          var e = b(this);
          "orderByWhatsApp" === e.data("method")
            ? v.proceedToOrderByWhatsApp(t)
            : console.log(e.data("method"));
        },
        closeAllModals: function () {
          C.modalCommon.modal("hide"), b(".modal-backdrop").remove();
        },
        openModal: function () {
          v.closeAllModals(),
            C.modalCommon.modal(),
            C.modalCommon.modal("handleUpdate");
        },
        categoryCalled: function (t) {
          t.u || (t.u = "all"),
            (t.u = a[t.u] ? t.u : "all"),
            v.loadCategoryProducts(t.u);
        },
        productCalled: function (t) {
          if (t.u) {
            if (
              (v.productDetails(t.u),
              C.mainContainer.addClass("main-container-additions"),
              !u[t.u])
            )
              return v.loadCategoryProducts("all"), !1;
            t = u[t.u].categoryIndex;
            m.isStoreLoaded || v.loadCategoryProducts(t);
          } else v.loadCategoryProducts("all");
        },
        onAllComplete: function () {
          v.closeAllModals();
          var t = y.dataFromURL();
          if (t.hasOwnProperty("category")) {
            if (m.preventHashChangedAction)
              return (m.preventHashChangedAction = !1);
            v.categoryCalled(t);
          } else if (t.hasOwnProperty("search")) {
            if (m.preventHashChangedAction)
              return (m.preventHashChangedAction = !1);
            v.searchProduct();
          } else
            t.hasOwnProperty("product")
              ? v.productCalled(t)
              : t.hasOwnProperty("shopping-cart")
              ? v.showShoppingCart()
              : v.loadCategoryProducts("all");
          m.isStoreLoaded || (m.isStoreLoaded = !0);
        },
      };

      function e() {
        20 < document.body.scrollTop || 20 < document.documentElement.scrollTop
          ? b("#lwGotoTop").fadeIn()
          : b("#lwGotoTop").fadeOut();
      }
      b(window).on("hashchange", function () {
        (m.hashChanged = !0), v.onAllComplete();
      }),
        b(window).on("resize", y.resizeNPosition),
        b("body").on("click", ".lw-load-more-content", v.loadMoreItems),
        C.categoriesList.on("click", ".category-link", v.categoryLinkAction),
        C.productsContainer.on(
          "click",
          ".add-to-cart-btn-grid-item-save",
          v.addToCartGridItem
        ),
        C.modalContainer.on("click", ".lw-hash-link-action", function (t) {
          t.preventDefault();
          var e = b(this).attr("href");
          _.delay(function () {
            location.hash = e;
          }, 500);
        }),
        C.modalContainer.on("click", ".add-to-cart-btn", v.addToCart),
        C.searchInput.on("keyup", v.onSearch),
        C.clearSearchBtn.on("click", function () {
          v.clearSearchResult(!1);
        }),
        C.productsContainer.on(
          "change",
          ".option-selector",
          v.updatedSelectedOption
        ),
        C.modalContainer.on(
          "change",
          ".option-selector",
          v.updatedSelectedOption
        ),
        C.modalContainer.on(
          "blur change",
          "input.cart-product-qty",
          v.updateCartItemQty
        ),
        C.modalContainer.on(
          "click",
          ".delete-product-from-cart",
          v.removeCartItem
        ),
        C.modalContainer.on("click", ".lw-checkout-button", v.processCheckout),
        C.modalContainer.on(
          "click",
          "#checkoutSubmitOrderBtn",
          v.proceedToOrderByWhatsApp
        ),
        C.modalContainer.on("click", "#submitOrderBtn", v.submitOrder),
        C.modalContainer.on(
          "click",
          "#backToCartBtn",
          v.backToCartFromSubmitForm
        ),
        C.modalContainer.on("change", "#orderTypeSelection", function () {
          (m.orderType = b(this).val()),
            v.updateCart(),
            v.showShoppingCart({
              preventModelReLoad: !0,
            });
        }),
        C.goToTop.on("click", y.goToTop),
        C.productsContainer.on(
          "mouseover",
          ".product-item",
          v.updateBreadCrumbOnOver
        ),
        C.modalCommon.on("hidden hidden.bs.modal", v.backFromModal),
        b(document).on("click", ".lw-number-spinner button", function () {
          var t = b(this),
            e = t.closest(".lw-number-spinner").find("input").val().trim(),
            r = 0,
            r =
              "up" == t.attr("data-dir")
                ? parseInt(e) + 1
                : 1 < e
                ? parseInt(e) - 1
                : 1;
          t.closest(".lw-number-spinner").find("input").val(r);
        }),
        (window.onscroll = function () {
          e();
        }),
        e(),
        b("body").on(
          "click",
          ".lw-sidebar-toggle-btn, .lw-sidebar-overlay",
          function (t) {
            t.preventDefault(), b("body").toggleClass("lw-sidebar-opened");
          }
        );
    });

  // ------------ my features
  // enabled btn cart order
  // $('body').on('click', ".shopping-cart-btn-container,.whatsapp-order", function () {
  //     setTimeout(() => {
  //         $('#whatsappCheckout').removeClass('disabled');
  //     }, 500);
  // })

  // hide spinner
  setTimeout(() => {
    $(".loader").fadeOut("800");
    $("body").css("overflow", "visible");
  }, 800);
})(jQuery);
