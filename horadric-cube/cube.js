var dragOptions = {
    stack: '#inventory div',
    containment: '#drag-threshold',
    revert: 'invalid'
};

$(function () {
    //Prevent selection on the page, since we'll be dragging a lot of things
    $('html').attr('unselectable', 'on').each(function () {
        this.onselectstart = function () { return false; };
    });

    //Add runes to the toolbar
    $.each(runes, function () {
        $('<div></div>').addClass('rune')
                        .attr('data-socket-item', this.shortName)
                        .rune()
                        .appendTo($('#toolbar'));
    });

    //Add gems to the toolbar
    $.each(gems, function () {
        $('<div></div>').addClass('gem')
                        .attr('data-socket-item', this.shortName)
                        .gem()
                        .appendTo($('#toolbar'));
    });

    //Add slots to the cube and inventory surfaces
    $('.slotted').slotted();

    //Clicked toolbar items should get added to the inventory when clicked
    $('#toolbar > div').click(function () {
        var slot = $('#inventory .slot:empty').filter(':first');
        $(this).clone().appendTo(slot).draggable(dragOptions);
    });

    //Setup rules text area
    for (i in rules) {
        var text = '';
        for (x in rules[i].input) {
            text += rules[i].input[x].replace('-', ' ');
            if (x < rules[i].input.length - 1) {
                text += ' + ';
            }

        }
        text += ' = ';

        if (rules[i].output.gem) {
            text += rules[i].output.gem.replace('-', ' ');
        } else if (rules[i].output.rune) {
            text += rules[i].output.rune;
        }
        $('<div></div>').text(text).appendTo($('#rules'));
    }

    //Set up button click handlers
    $('#clear-cube-button').click(function () {
        $('#horadric-cube .socket-item').remove();
        ResetSlots();
    });

    $('#transmute').click(function () {
        RunRules($('#horadric-cube .socket-item'));
    });

    $('#clear-inventory-button').click(function () {
        $('#inventory .socket-item').remove();
        ResetSlots();
    });
});

//Run rules agains items in the cube
function RunRules(items) {
    if (items.length === 0) return;

    var itemArray = [];
    items.each(function () {
        itemArray.push($(this).attr('data-socket-item'));
    })

    for (i in rules) {
        var rule = rules[i];
        if ($.compare(rule.input, itemArray)) {
            items.remove();
            var slot = $('#horadric-cube .slot:empty').filter(':first');
            var newItem = $('<div></div>').draggable(dragOptions).appendTo(slot);

            if (rule.output.rune) {
                newItem.attr('data-socket-item', rule.output.rune).rune();
            } else if (rule.output.gem) {
                newItem.attr('data-socket-item', rule.output.gem).gem();
            }

            ResetSlots();

            return;
        }
    }
}

//Re-initialize drag/drop for empty slots
function ResetSlots() {
    $('.slot:empty').droppable('option', 'accept', '.socket-item');
}

//Define our gems, give them friendly and short names
var gems = {
	gcv: { name: 'Chipped Amethyst', shortName: 'chipped-amethyst' },
	gfv: { name: 'Flawed Amethyst', shortName: 'flawed-amethyst' },
	gsv: { name: 'Amethyst', shortName: 'amethyst' },
	gzv: { name: 'Flawless Amethyst', shortName: 'flawless-amethyst' },
	gpv: { name: 'Perfect Amethyst', shortName: 'perfect-amethyst' },
	gcb: { name: 'Chipped Sapphire', shortName: 'chipped-sapphire' },
	gfb: { name: 'Flawed Sapphire', shortName: 'flawed-sapphire' },
	gsb: { name: 'Sapphire', shortName: 'sapphire' },
	glb: { name: 'Flawless Sapphire', shortName: 'flawless-sapphire' },
	gpb: { name: 'Perfect Sapphire', shortName: 'perfect-sapphire' },
	gcg: { name: 'Chipped Emerald', shortName: 'chipped-emerald' },
	gfg: { name: 'Flawed Emerald', shortName: 'flawed-emerald' },
	gsg: { name: 'Emerald', shortName: 'emerald' },
	glg: { name: 'Flawless Emerald', shortName: 'flawless-emerald' },
	gpg: { name: 'Perfect Emerald', shortName: 'perfect-emerald' },
	gcr: { name: 'Chipped Ruby', shortName: 'chipped-ruby' },
	gfr: { name: 'Flawed Ruby', shortName: 'flawed-ruby' },
	gsr: { name: 'Ruby', shortName: 'ruby' },
	glr: { name: 'Flawless Ruby', shortName: 'flawless-ruby' },
	gpr: { name: 'Perfect Ruby', shortName: 'perfect-ruby' },
	gcw: { name: 'Chipped Diamond', shortName: 'chipped-diamond' },
	gfw: { name: 'Flawed Diamond', shortName: 'flawed-diamond' },
	gsw: { name: 'Diamond', shortName: 'diamond' },
	glw: { name: 'Flawless Diamond', shortName: 'flawless-diamond' },
	gpw: { name: 'Perfect Diamond', shortName: 'perfect-diamond' },
	gcy: { name: 'Chipped Topaz', shortName: 'chipped-topaz' },
	gfy: { name: 'Flawed Topaz', shortName: 'flawed-topaz' },
	gsy: { name: 'Topaz', shortName: 'topaz' },
	gly: { name: 'Flawless Topaz', shortName: 'flawless-topaz' },
	gpy: { name: 'Perfect Topaz', shortName: 'perfect-topaz' }
};

//Define our runes, give them friendly and short names
var runes = {
	r01: { name: 'El Rune', shortName: 'el' },
	r02: { name: 'Eld Rune', shortName: 'eld' },
	r03: { name: 'Tir Rune', shortName: 'tir' },
	r04: { name: 'Nef Rune', shortName: 'nef' },
	r05: { name: 'Eth Rune', shortName: 'eth' },
	r06: { name: 'Ith Rune', shortName: 'ith' },
	r07: { name: 'Tal Rune', shortName: 'tal' },
	r08: { name: 'Ral Rune', shortName: 'ral' },
	r09: { name: 'Ort Rune', shortName: 'ort' },
	r10: { name: 'Thul Rune', shortName: 'thul' },
	r11: { name: 'Amn Rune', shortName: 'amn' },
	r12: { name: 'Sol Rune', shortName: 'sol' },
	r13: { name: 'Shael Rune', shortName: 'shael' },
	r14: { name: 'Dol Rune', shortName: 'dol' },
	r15: { name: 'Hel Rune', shortName: 'hel' },
	r16: { name: 'Io Rune', shortName: 'io' },
	r17: { name: 'Lum Rune', shortName: 'lum' },
	r18: { name: 'Ko Rune', shortName: 'ko' },
	r19: { name: 'Fal Rune', shortName: 'fal' },
	r20: { name: 'Lem Rune', shortName: 'lem' },
	r21: { name: 'Pul Rune', shortName: 'pul' },
	r22: { name: 'Um Rune', shortName: 'um' },
	r23: { name: 'Mal Rune', shortName: 'mal' },
	r24: { name: 'Ist Rune', shortName: 'ist' },
	r25: { name: 'Gul Rune', shortName: 'gul' },
	r26: { name: 'Vex Rune', shortName: 'vex' },
	r27: { name: 'Ohm Rune', shortName: 'ohm' },
	r28: { name: 'Lo Rune', shortName: 'lo' },
	r29: { name: 'Sur Rune', shortName: 'sur' },
	r30: { name: 'Ber Rune', shortName: 'ber' },
	r31: { name: 'Jah Rune', shortName: 'jah' },
	r32: { name: 'Cham Rune', shortName: 'cham' },
	r33: { name: 'Zod Rune', shortName: 'zod' },
};

//Define a rule class
function Rule(input, output){
	this.input = input;
	this.output = output;
}

//Define rules which determine outputs given specific inputs
var rules = [
	new Rule(['el', 'el', 'el'], { rune: 'eld' }),
	new Rule(['eld', 'eld', 'eld'], { rune: 'tir' }),
	new Rule(['tir', 'tir', 'tir'], { rune: 'nef' }),
	new Rule(['nef', 'nef', 'nef'], { rune: 'eth' }),
	new Rule(['eth', 'eth', 'eth'], { rune: 'ith' }),
	new Rule(['ith', 'ith', 'ith'], { rune: 'tal' }),
	new Rule(['tal', 'tal', 'tal'], { rune: 'ral' }),
	new Rule(['ral', 'ral', 'ral'], { rune: 'ort' }),
	new Rule(['ort', 'ort', 'ort'], { rune: 'thul' }),
	new Rule(['thul', 'thul', 'thul', 'chipped-topaz'], { rune: 'amn' }),
	new Rule(['amn', 'amn', 'amn', 'chipped-amethyst'], { rune: 'sol' }),
	new Rule(['sol', 'sol', 'sol', 'chipped-sapphire'], { rune: 'shael' }),
	new Rule(['shael', 'shael', 'shael', 'chipped-ruby'], { rune: 'dol' }),
	new Rule(['dol', 'dol', 'dol', 'chipped-emerald'], { rune: 'hel' }),
	new Rule(['hel', 'hel', 'hel', 'chipped-diamond'], { rune: 'io' }),
	new Rule(['io', 'io', 'io', 'flawed-topaz'], { rune: 'lum' }),
	new Rule(['lum', 'lum', 'lum', 'flawed-amethyst'], { rune: 'ko' }),
	new Rule(['ko', 'ko', 'ko', 'flawed-sapphire'], { rune: 'fal' }),
	new Rule(['fal', 'fal', 'fal', 'flawed-ruby'], { rune: 'lem' }),
	new Rule(['lem', 'lem', 'lem', 'flawed-emerald'], { rune: 'pul' }),
	new Rule(['pul', 'pul', 'flawed-diamond'], { rune: 'um' }),
	new Rule(['um', 'um', 'topaz'], { rune: 'mal' }),
	new Rule(['mal', 'mal', 'amethyst'], { rune: 'ist' }),
	new Rule(['ist', 'ist', 'sapphire'], { rune: 'gul' }),
	new Rule(['gul', 'gul', 'ruby'], { rune: 'vex' }),
	new Rule(['vex', 'vex', 'emerald'], { rune: 'ohm' }),
	new Rule(['ohm', 'ohm', 'diamond'], { rune: 'lo' }),
	new Rule(['lo', 'lo', 'flawless-topaz'], { rune: 'sur' }),
	new Rule(['sur', 'sur', 'flawless-amethyst'], { rune: 'ber' }),
	new Rule(['ber', 'ber', 'flawless-sapphire'], { rune: 'jah' }),
	new Rule(['jah', 'jah', 'flawless-ruby'], { rune: 'cham' }),
	new Rule(['cham', 'cham', 'flawless-emerald'], { rune: 'zod' }),
	new Rule(['chipped-amethyst', 'chipped-amethyst', 'chipped-amethyst'], { gem: 'flawed-amethyst' }),
	new Rule(['flawed-amethyst', 'flawed-amethyst', 'flawed-amethyst'], { gem: 'amethyst' }),
	new Rule(['amethyst', 'amethyst', 'amethyst'], { gem: 'flawless-amethyst' }),
	new Rule(['flawless-amethyst', 'flawless-amethyst', 'flawless-amethyst'], { gem: 'perfect-amethyst' }),
	new Rule(['chipped-sapphire', 'chipped-sapphire', 'chipped-sapphire'], { gem: 'flawed-sapphire' }),
	new Rule(['flawed-sapphire', 'flawed-sapphire', 'flawed-sapphire'], { gem: 'sapphire' }),
	new Rule(['sapphire', 'sapphire', 'sapphire'], { gem: 'flawless-sapphire' }),
	new Rule(['flawless-sapphire', 'flawless-sapphire', 'flawless-sapphire'], { gem: 'perfect-sapphire' }),
	new Rule(['chipped-emerald', 'chipped-emerald', 'chipped-emerald'], { gem: 'flawed-emerald' }),
	new Rule(['flawed-emerald', 'flawed-emerald', 'flawed-emerald'], { gem: 'emerald' }),
	new Rule(['emerald', 'emerald', 'emerald'], { gem: 'flawless-emerald' }),
	new Rule(['flawless-emerald', 'flawless-emerald', 'flawless-emerald'], { gem: 'perfect-emerald' }),
	new Rule(['chipped-ruby', 'chipped-ruby', 'chipped-ruby'], { gem: 'flawed-ruby' }),
	new Rule(['flawed-ruby', 'flawed-ruby', 'flawed-ruby'], { gem: 'ruby' }),
	new Rule(['ruby', 'ruby', 'ruby'], { gem: 'flawless-ruby' }),
	new Rule(['flawless-ruby', 'flawless-ruby', 'flawless-ruby'], { gem: 'perfect-ruby' }),
	new Rule(['chipped-diamond', 'chipped-diamond', 'chipped-diamond'], { gem: 'flawed-diamond' }),
	new Rule(['flawed-diamond', 'flawed-diamond', 'flawed-diamond'], { gem: 'diamond' }),
	new Rule(['diamond', 'diamond', 'diamond'], { gem: 'flawless-diamond' }),
	new Rule(['flawless-diamond', 'flawless-diamond', 'flawless-diamond'], { gem: 'perfect-diamond' }),
	new Rule(['chipped-topaz', 'chipped-topaz', 'chipped-topaz'], { gem: 'flawed-topaz' }),
	new Rule(['flawed-topaz', 'flawed-topaz', 'flawed-topaz'], { gem: 'topaz' }),
	new Rule(['topaz', 'topaz', 'topaz'], { gem: 'flawless-topaz' }),
	new Rule(['flawless-topaz', 'flawless-topaz', 'flawless-topaz'], { gem: 'perfect-topaz' })
];


(function ($) {
	
	//Define some jQuery plugins 
    $.fn.extend({
		//Initializes items as runes
        rune: function (options) {
			return this.each(function () {
                var name = $(this).attr('data-socket-item');
				$(this).addClass(name).addClass('rune socket-item').attr('title', name);
            });
        },
		//Initializes items as gems
		gem: function (options) {
			return this.each(function () {
				var name = $(this).attr('data-socket-item');
				$(this).addClass(name).addClass('gem socket-item').attr('title', name);
            });
        },
		//Initializes items as slotted surfaces, adds drag/drop functionality
		slotted: function (options) {
		
			return this.each(function() {
				var number = $(this).attr('data-slots');
				var index;
				for(index = 0; index < number; index++){
				
					$('<div></div>').addClass('slot')
									.appendTo($(this))
									.droppable({
										accept: '.socket-item',
										activeClass: 'ui-state-hover',
										drop: function(event, ui) { 
											var dropped = $('<div></div>').draggable(dragOptions)
																		  .attr('data-socket-item', ui.draggable.attr('data-socket-item'))
																		  .appendTo($(this));
											
											if(ui.draggable.hasClass('rune')){
												dropped.rune();
											} else if(ui.draggable.hasClass('gem')){
												dropped.gem();
											}
											
											ui.draggable.remove();
											$(this).droppable('option', 'accept', '');
											ResetSlots();
										}
									});
				}
			});
		}
    });

	//Add a method for checking two arrays for equality
	$.extend({
		compare: function (arrayA, arrayB) {
			if (arrayA.length != arrayB.length) { return false; }
			var a = jQuery.extend(true, [], arrayA);
			var b = jQuery.extend(true, [], arrayB);
			a.sort(); 
			b.sort();
			for (var i = 0, l = a.length; i < l; i++) {
				if (a[i] !== b[i]) { 
					return false;
				}
			}
			return true;
		}
	});
})(jQuery);