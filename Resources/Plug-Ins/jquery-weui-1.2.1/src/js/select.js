/* global $:true */
+ function($) {
  "use strict";

  var defaults;

  var selects = [];

  var Select = function(input, config) {

    var self = this;
    this.config = config;

    //init empty data
    this.data = {
      values: '',
      titles: '',
      origins: [],
      length: 0
    };

    this.$input = $(input);
    this.$input.prop("readOnly", true);

    this.initConfig();

    config = this.config;

    this.$input.click($.proxy(this.open, this));
    selects.push(this)
  }

  Select.prototype.initConfig = function() {
    this.config = $.extend({}, defaults, this.config);

    var config = this.config;

    if(!config.items || !config.items.length) return;

    config.items = config.items.map(function(d, i) {
      if(typeof d == typeof "a") {
        return {
          title: d,
          value: d
        };
      }

      return d;
    });


    this.tpl = $.t7.compile("<div class='weui-picker-modal weui-select-modal'>" + config.toolbarTemplate + (config.multi ? config.checkboxTemplate : config.radioTemplate) + "</div>");

    if(config.input !== undefined) this.$input.val(config.input);

    this.parseInitValue();

    this._init = true;
  }

  Select.prototype.updateInputValue = function(values, titles) {
    var v, t;
    if(this.config.multi) {
      v = values.join(this.config.split);
      t = titles.join(this.config.split);
    } else {
      v = values[0];
      t = titles[0];
    }

    //caculate origin data
    var origins = [];

    this.config.items.forEach(function(d) {
      values.each(function(i, dd) {
        if(d.value == dd) origins.push(d);
      });
    });

    this.$input.val(t).data("values", v);
    this.$input.attr("value", t).attr("data-values", v);

    var data = {
      values: v,
      titles: t,
      valuesArray: values,
      titlesArray: titles,
      origins: origins,
      length: origins.length
    };
    this.data = data;
    this.$input.trigger("change", data);
    this.config.onChange && this.config.onChange.call(this, data);
  }

  Select.prototype.parseInitValue = function() {
    var value = this.$input.val();
    var items = this.config.items;

    //??????input????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
    if( !this._init && (value === undefined || value == null || value === "")) return;

    var titles = this.config.multi ? value.split(this.config.split) : [value];
    for(var i=0;i<items.length;i++) {
      items[i].checked = false;
      for(var j=0;j<titles.length;j++) {
        if(items[i].title === titles[j]) {
          items[i].checked = true;
        }
      }
    }
  }

  Select.prototype._bind = function(dialog) {
    var self = this,
        config = this.config;
    dialog.on("change", function(e) {
      var checked = dialog.find("input:checked");
      var values = checked.map(function() {
        return $(this).val();
      });
      var titles = checked.map(function() {
        return $(this).data("title");
      });
      self.updateInputValue(values, titles);

      if(config.autoClose && !config.multi) self.close();
    })
    .trigger('change')
    .on("click", ".close-select", function() {
      self.close();
    });
  }

  //????????????
  Select.prototype.update = function(config) {
    this.config = $.extend({}, this.config, config);
    this.initConfig();
    if(this._open) {
      this._bind($.updatePicker(this.getHTML()));
    }
  }
  
  Select.prototype.open = function(values, titles) {

    if(this._open) return;

    // open picker ????????????????????????????????? onClose ?????????????????????????????????????????????select
    for (var i = 0; i < selects.length; i++ ) {
      var s = selects[i];
      if (s === this) continue;
      if (s._open) {
        if(!s.close()) return false; // ?????????select???????????????????????????????????????
      }
    }

    this.parseInitValue();

    var config = this.config;

    var dialog = this.dialog = $.openPicker(this.getHTML());
    
    this._bind(dialog);

    this._open = true;
    if(config.onOpen) config.onOpen(this);
  }

  Select.prototype.close = function(callback, force) {
    if (!this._open) return false;
    var self = this,
        beforeClose = this.config.beforeClose;

    if(typeof callback === typeof true) {
      force === callback;
    }
    if(!force) {
      if(beforeClose && typeof beforeClose === 'function' && beforeClose.call(this, this.data.values, this.data.titles) === false) {
        return false
      }
      if(this.config.multi) {
        if(this.config.min !== undefined && this.data.length < this.config.min) {
          $.toast("???????????????"+this.config.min+"???", "text");
          return false
        }
        if(this.config.max !== undefined && this.data.length > this.config.max) {
          $.toast("??????????????????"+this.config.max+"???", "text");
          return false
        }
      }
    }
    $.closePicker(function() {
      self.onClose();
      callback && callback();
    });

    return true
  }

  Select.prototype.onClose = function() {
    this._open = false;
    if(this.config.onClose) this.config.onClose(this);
  }

  Select.prototype.getHTML = function(callback) {
    var config = this.config;
    return this.tpl({
      items: config.items,
      title: config.title,
      closeText: config.closeText
    })
  }


  $.fn.select = function(params, args) {

    return this.each(function() {
      var $this = $(this);
      if(!$this.data("weui-select")) $this.data("weui-select", new Select(this, params));

      var select = $this.data("weui-select");

      if(typeof params === typeof "a") select[params].call(select, args);

      return select;
    });
  }

  defaults = $.fn.select.prototype.defaults = {
    items: [],
    input: undefined, //?????????????????????
    title: "?????????",
    multi: false,
    closeText: "??????",
    autoClose: true, //??????????????????????????????????????????????????????????????????
    onChange: undefined, //function
    beforeClose: undefined, // function ???????????????????????????false???????????????
    onClose: undefined, //function
    onOpen: undefined, //function
    split: ",",  //???????????????????????????
    min: undefined, //???????????????????????????????????????
    max: undefined, //???????????????????????????????????????
    toolbarTemplate: '<div class="toolbar">\
      <div class="toolbar-inner">\
      <a href="javascript:;" class="picker-button close-select">{{closeText}}</a>\
      <h1 class="title">{{title}}</h1>\
      </div>\
      </div>',
    radioTemplate:
      '<div class="weui-cells weui-cells_radio">\
        {{#items}}\
        <label class="weui-cell weui-check_label" for="weui-select-id-{{this.title}}">\
          <div class="weui-cell__bd weui-cell_primary">\
            <p>{{this.title}}</p>\
          </div>\
          <div class="weui-cell__ft">\
            <input type="radio" class="weui-check" name="weui-select" id="weui-select-id-{{this.title}}" value="{{this.value}}" {{#if this.checked}}checked="checked"{{/if}} data-title="{{this.title}}">\
            <span class="weui-icon-checked"></span>\
          </div>\
        </label>\
        {{/items}}\
      </div>',
    checkboxTemplate:
      '<div class="weui-cells weui-cells_checkbox">\
        {{#items}}\
        <label class="weui-cell weui-check_label" for="weui-select-id-{{this.title}}">\
          <div class="weui-cell__bd weui-cell_primary">\
            <p>{{this.title}}</p>\
          </div>\
          <div class="weui-cell__ft">\
            <input type="checkbox" class="weui-check" name="weui-select" id="weui-select-id-{{this.title}}" value="{{this.value}}" {{#if this.checked}}checked="checked"{{/if}} data-title="{{this.title}}" >\
            <span class="weui-icon-checked"></span>\
          </div>\
        </label>\
        {{/items}}\
      </div>',
  }

}($);
