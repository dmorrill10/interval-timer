var ActionTimer, Timer,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Timer = (function() {
  function Timer() {
    this.timeoutId = null;
  }

  Timer.prototype.isCounting = function() {
    return this.timeoutId != null;
  };

  Timer.prototype.clear = function() {
    if (this.timeoutId != null) {
      clearTimeout(this.timeoutId);
      return this.timeoutId = null;
    }
  };

  Timer.prototype.start = function(fn, period) {
    if (this.isCounting()) {
      this.stop();
    }
    return this.timeoutId = setTimeout(fn, period);
  };

  Timer.prototype.stop = function() {
    return this.clear();
  };

  return Timer;

})();


ActionTimer = (function(superClass) {
  extend(ActionTimer, superClass);

  function ActionTimer(timerElement, onTimeout) {
    this.onTimeout = onTimeout;
    this.timerElement = timerElement;
    ActionTimer.__super__.constructor.call(this);
  }

  ActionTimer.prototype.getTimeRemaining = function() {
    return parseInt($(this.timerElement).text(), 10);
  };

  ActionTimer.prototype.setTimeRemaining = function(timeRemaining) {
    if ((timeRemaining == null) || isNaN(timeRemaining)) {
      return;
    }
    if (timeRemaining < 0) {
      timeRemaining = 0;
    }
    return $(this.timerElement).text(timeRemaining);
  };

  ActionTimer.prototype.start = function() {
    return ActionTimer.__super__.start.call(this, (function(_this) {
      return function() {
        return _this.afterEachSecond(_this.onTimeout);
      };
    })(this), 1000);
  };

  ActionTimer.prototype.afterEachSecond = function() {
    var timeRemaining;
    timeRemaining = this.getTimeRemaining();
    if (timeRemaining != null) {
      if (timeRemaining <= 0) {
        return this.onTimeout();
      } else {
        this.setTimeRemaining(timeRemaining - 1);
        return this.start((function(_this) {
          return function() {
            return _this.afterEachSecond(_this.onTimeout);
          };
        })(this));
      }
    } else {
      return this.start((function(_this) {
        return function() {
          return _this.afterEachSecond(_this.onTimeout);
        };
      })(this));
    }
  };

  ActionTimer.prototype.pause = function() {
    return this.timeRemaining = this.getTimeRemaining();
  };

  ActionTimer.prototype.resume = function() {
    return this.setTimeRemaining(this.timeRemaining);
  };

  return ActionTimer;

})(Timer);

$(function() {
  var bind_start = function(elem) {
    $(elem).click(function(e) {
      var hours_input = $(e.target.parentNode.parentNode).find('input.hours');
      var minutes_input = $(e.target.parentNode.parentNode).find('input.minutes');
      var seconds_input = $(e.target.parentNode.parentNode).find('input.seconds');
      var countdown = $(e.target.parentNode.parentNode).find('.time-remaining');
      countdown.text(
        parseInt(hours_input.val()) * 3600
        + parseInt(minutes_input.val()) * 60
        + parseInt(seconds_input.val()));

      // TODO This activates on stop as well

      var timer = new ActionTimer(
        countdown,
        function() {
          var hours_input = $(e.target.parentNode.parentNode).find('input.hours');
          var minutes_input = $(e.target.parentNode.parentNode).find('input.minutes');
          var seconds_input = $(e.target.parentNode.parentNode).find('input.seconds');
          var countdown = $(e.target.parentNode.parentNode).find('.time-remaining');
          countdown.text(
            parseInt(hours_input.val()) * 3600
            + parseInt(minutes_input.val()) * 60
            + parseInt(seconds_input.val()));
          timer.start();
        });

      $(e.target).text('Stop').removeClass('start').addClass('stop');
      $(e.target).click(function(e2) {
        $(e2.target).text('Start').removeClass('stop').addClass('start');
        timer.stop();
        bind_start(e2.target);
      });
      timer.start();
    });
  };
  bind_start('.start');
});
