function sele(option, str){
	switch(option){
		case 1:  return document.querySelector('.caeser_' + str);
		case 2:  return document.querySelector('.playfair_' + str);
		case 3:  return document.querySelector('.hill_' + str);
		default :  return document.querySelector(options + str);
		
	}
}

function renderDOM(choice, prefix, temp, de){
	if(de === 'de'){
		sele(choice, 'show').innerHTML += '<div class="' + prefix + 'show_de_arr">解密字符串：' +
            temp.join('&nbsp;') +
            '</div>';
    }else{
		sele(choice, 'show').innerHTML = '加密字符串：<div class="' + prefix + 'show_str">' +
            temp.join('&nbsp;') +
            '</div>' +
            '<button class="' + prefix + 'decrypt">解密</button>';
    }
}
function render(option, callback) {
    var options = {
            // 匹配全英文 + 空格
            match: /^[A-Za-z\s]+$/,
            // 加密的事件处理函数
            en_handle: function() {},
            // 解密的时间处理函数
            de_handle: function() {},
            // 前缀
            prefix: "",
        };
        // 初始化默认值
        for (var i in options) {
        	if(!option[i]){
            	option[i] = options[i];
            }
        }
        callback.call(option);
    }
(function(){	
    sele(1, 'encrypt').addEventListener('click', function(event) {
        render({
            prefix: 'caeser_',
            // 未对这个进行检查类型
            DEVIATION: parseInt(sele(1,'num').value),
            de_handle: function(event) {
                var temp = [],
                	interpreter = ['A', 'B', 'C', 'D', 'E', 'F', 'G',
						'H', 'I', 'J', 'K', 'L', 'M', 'N',
						'O', 'P', 'Q', 'R', 'S', 'T',
						'U', 'V', 'W', 'X', 'Y', 'Z'],
                    str = sele(1, 'show_str');
                if (str) {
                    str = str.innerHTML;
                }
                for (var i = 0; i < str.length; i++) {
                    if (str[i] === ' ') {
                        temp.push(' ');
                        continue;
                    }
                    temp.push(interpreter[(str.charCodeAt(i) - this.DEVIATION - 65 + 26) % 26]);
                }
                renderDOM(1,  this.prefix, temp, 'de');
            }
        },function(){
        	// 回调函数
        	var i = 0,
        		en_arr = [],
        		_this = this;
			// 'a' code is 97；'A' code is 65
			for(i = 0; i < 26; i++ ){
				en_arr.push(String.fromCharCode(65 + i));
			}
			for(i = 0; i < this.DEVIATION; i++){
				en_arr.push(en_arr.shift());
			}
			var encrypt = sele(1, 'encrpt');

			// 要加密的文本%%
	        var str = sele(1, 'text').value,
	            temp = [];

	        if (str.match(this.match)) {
	            str = str.toLocaleUpperCase();
	            for (var i = 0; i < str.length; i++) {
	                if (str[i] === ' ') {
	                    temp.push(' ');
	                    continue;
	                }
	                temp.push(en_arr[str.charCodeAt(i) - 65]);
	            }
	            renderDOM(1, this.prefix, temp, 'en');
            };
            sele(1, 'decrypt').addEventListener('click', function(event){
            	_this.de_handle.call( _this, event);
            });
        });

    });

    sele(2, 'encrypt').addEventListener('click', function(event){
    	render({
    		prefix: 'playfair_',
    		DEVIATION: sele(2, 'num').value,
			de_handle: function(event, temp, arr){
				// temp为你保存的字符数组；
				var de_arr = [],
					pos_x1 = 0,
					pos_y1 = 0,
					pos_x2 = 0,
					pos_y2 = 0,
					temp_str = '';
				// 对于每一个两个字母的组合
				for(var i = 0; i < temp.length; i++) {
					// 对于
					temp_str = temp[i];
					// 先处理为I和J的情况
					if(temp_str[0] === 'I' || temp_str[0] === 'J' ){
						pos_x1 = 0;
						pos_y1 = 1;
					}
					if(temp_str[1] === 'I' || temp_str[1] === 'J' ){
						pos_x2 = 0;
						pos_y2 = 1;
					}
					for(j = 0; j < 5; j++){
						if(arr[j].indexOf(temp_str[0]) != -1){
							pos_x1 = arr[j].indexOf(temp_str[0]);
							pos_y1 = j;
						    console.log('位置在%d,%d', pos_x1, pos_y1 );
						};
						if(arr[j].indexOf(temp_str[1]) != -1){
							pos_x2 = arr[j].indexOf(temp_str[1]);
							pos_y2 = j;
						    console.log('位置在%d,%d', pos_x2, pos_y2);
						};
					}
					if(pos_y1 === pos_y2){
						// 同行
						pos_x1 = (pos_x1 - 1 + 5) % 5;
						pos_x2 = (pos_x2 - 1 + 5) % 5;

					}else if(pos_x1 === pos_x2){
						// 同列
						pos_y1 = (pos_y1 - 1 + 5) % 5;
						pos_y2 = (pos_y2 - 1 + 5) % 5;

					}else{
						// 不同行且不同列(x1, y1)(x2, y2)，那么得出的结果就是(x2, y1)(x1, y2);也就是说交换x1和x2就行了。
						pos_x1 += pos_x2;
						pos_x2 = pos_x1 - pos_x2;
						pos_x1 = pos_x1 - pos_x2;
					}
					de_arr.push(function(){
						// 特殊处理I/J这两个字符
						if(arr[pos_y1][pos_x1] === 'I/J'|| arr[pos_y2][pos_x2] === 'I/J'){
							return [arr[pos_y1][pos_x1][0], arr[pos_y2][pos_x2][0]];
						}
						return [arr[pos_y1][pos_x1], arr[pos_y2][pos_x2]];
					}());
				}
				renderDOM(2, this.prefix, de_arr, 'de');
			}
    	},function(){
    		// 初始化页面
    		var encrypt = sele(2, 'encrpt'),
			// 要加密的文本%%
	        	str = sele(2, 'text').value,
	            temp = [],
	            _this = this,
	            i,
				j,
				arr = [],
				DEVIATION = this.DEVIATION.toLocaleUpperCase(),
				pos_x1 = 0,
				pos_y1 = 0,
				pos_x2 = 0,
				pos_y2 = 0,
				temp_str = ['A', 'B', 'C', 'D', 'E', 'F', 'G',
						'H', 'I/J', 'K', 'L', 'M', 'N',
						'O', 'P', 'Q', 'R', 'S', 'T',
						'U', 'V', 'W', 'X', 'Y', 'Z'];

			if(!str.match(/^[A-Za-z\s]+$/)){
				alert('输入字符串不符合要求，字符串格式为英文+空格');
			}{

				// 初始化arr，arr为字符串，还缺这个
				DEVIATION = DEVIATION.replace(/\s+/g,'');
				for(i = 0; i < DEVIATION.length; i++){
					if(arr.indexOf(DEVIATION[i]) !== -1){
						if(arr.indexOf('I/J') === -1 &&
							( DEVIATION[i] === 'I'
								|| DEVIATION[i] === 'J') ){
							arr.push('I/J');
						}
					}else{
						if(arr.indexOf('I/J') === -1 &&
							( DEVIATION[i] === 'I'
								|| DEVIATION[i] === 'J') ){
							arr.push('I/J');
						}else{
							arr.push(DEVIATION[i]);
						}
					}
				}
				for(i = 0; i < 25; i++){
					if(arr.indexOf(temp_str[i]) === -1){
						arr.push(temp_str[i]);
					}
				}
				console.log(arr);
				// 现在arr为一维数组，我们要把这个变成二维数组
				for(i = 0; i < 5; i = i + 1){
					var sec_arr = arr.splice(0, 5);
					arr.push(sec_arr);
				}

				temp_str = '';
				str = str.toLocaleUpperCase();
				// 对于字符串先去掉原本的空格，还有一个操作就是两个字母加空格，在重复的字母里面插入一个填充字符Z
				str = str.replace(/\s+/g,'');
				// a是奇数，最后一个+1
				for(i = 0; i < str.length; ){
					// 将处理好的字母推进去temp，同时处理字符串。
					if(str[i] === str[i + 1]){
						// 字符串原本为str[i] + 'Z';
						temp_str = str[i] + 'Z';
						i++;
					}else if(i === str.length -1){
						temp_str = str[i] + 'Z';
						i++;
					}else{
						temp_str = str[i] + str[i + 1];
						i = i + 2;
					}

					// 先处理为I和J的情况
					if(temp_str[0] === 'I' || temp_str[0] === 'J' ){
						pos_x1 = 0;
						pos_y1 = 1;
					}
					if(temp_str[1] === 'I' || temp_str[1] === 'J' ){
						pos_x2 = 0;
						pos_y2 = 1;
					}
					for(j = 0; j < 5; j++){
						if(arr[j].indexOf(temp_str[0]) != -1){
							pos_x1 = arr[j].indexOf(temp_str[0]);
							pos_y1 = j;
						    console.log('位置在第%d列,第%d行', pos_x1, pos_y1 );
						};
						if(arr[j].indexOf(temp_str[1]) != -1){
							pos_x2 = arr[j].indexOf(temp_str[1]);
							pos_y2 = j;
						    console.log('位置在第%d列,第%d行', pos_x2, pos_y2);
						};
					}
					if(pos_y1 === pos_y2){
						// 同行
						pos_x1 = (pos_x1 + 1) % 5;
						pos_x2 = (pos_x2 + 1) % 5;

					}else if(pos_x1 === pos_x2){
						// 同列
						pos_y1 = (pos_y1 + 1) % 5;
						pos_y2 = (pos_y2 + 1) % 5;

					}else{
						// 不同行且不同列(x1, y1)(x2, y2)，那么得出的结果就是(x2, y1)(x1, y2);也就是说交换x1和x2就行了。
						pos_x1 += pos_x2;
						pos_x2 = pos_x1 - pos_x2;
						pos_x1 = pos_x1 - pos_x2;
					}
					temp.push(function(){
						// 特殊处理I/J这两个字符
						if(arr[pos_y1][pos_x1] === 'I/J'|| arr[pos_y2][pos_x2] === 'I/J'){
							return [arr[pos_y1][pos_x1][0], arr[pos_y2][pos_x2][0]];
						}
						return [arr[pos_y1][pos_x1], arr[pos_y2][pos_x2]];
					}());
				}
			}
			renderDOM(2, this.prefix, temp, 'en');
			sele(2, 'decrypt').addEventListener('click', function(event){
            	_this.de_handle.call( _this, event, temp, arr);
            });
    	});
    });
	sele(3, 'encrypt').addEventListener('click', function(event){
    	render({
    		prefix: 'hill_',
    		interpreter: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 
						'H', 'I', 'J', 'K', 'L', 'M', 'N',
						'O', 'P', 'Q', 'R', 'S', 'T',
						'U', 'V', 'W', 'X', 'Y', 'Z'],

			// 矩阵相乘
			_matrix_mul: function(matrix, arr){
				var i = 0,
					j = 0,
					n = matrix[0].length;
					result = [];
				for(i = 0; i < n; i++){
					result.push([]); // 设置结果矩阵为3*1;
				}
				// 首先要判断是否满足矩阵相乘的条件
				if(matrix[0].length === arr.length){
					for(i = 0; i < matrix.length; i++){
						for(j = 0; j < arr[0].length; j++){
							result[i][j] = 0; // 初始化result[i][j]为0而不是undefined
							for(k = 0; k < n; k++){
								result[i][j] += matrix[i][k] * arr[k][j];
							}
							result[i][j] %= 26; 
						}	
					}
					return result;
				}else{
					throw new Error('矩阵相乘的时候出错了');
				}
			},
			_inter: function(arr){
				for(var i = 0,length = arr.length; i < length; i++){
					arr[i] = this.interpreter[arr[i]];
				}
				return arr;
			},
			de_handle: function(event, temp){
				// temp为你保存的字符数组；
				var de_arr = [],
					pos_x1 = 0,
					pos_y1 = 0,
					pos_x2 = 0,
					pos_y2 = 0,
					temp_str = '';
				// 对于每一个三个字母的组合
				for(i = 0, length = temp.length; i < length; i++){
					var num_temp = [],
						char_temp = temp[i];
					// 将分组的字母在数组中的位置放进num_temp中。
					num_temp.push([this.interpreter.indexOf(char_temp[0])]);
					num_temp.push([this.interpreter.indexOf(char_temp[1])]);
					num_temp.push([this.interpreter.indexOf(char_temp[2])]);

					// 函数，矩阵相乘，返回结果(结果已经被26除)
					de_arr[i] = this._matrix_mul(this.de_matrix, num_temp);

					// 转化对应的数字为字母。
					de_arr[i] = this._inter.call(this, de_arr[i]);

				}
				renderDOM(3, this.prefix, de_arr, 'de');
			}
    	},function(){
    		// 实验3的矩阵是自己自动生成的
			var en_matrix = [],
				de_matrix = [],
				encrypt = sele(3, 'encrypt'),
				a = sele(3, 'text').value,
				i,
				j,
				pos_x1 = 0,
				pos_y1 = 0,
				pos_x2 = 0,
				pos_y2 = 0,
				temp_str = '',
				temp = [],
				length,
				_this = this;
			if(!a.match(/^[A-Za-z\s]+$/)){
				alert('输入字符串不符合要求，字符串格式为英文+空格');
			}{

				// 首先将初始化矩阵，
				// 我们可以先生成一个下三角矩阵，因为下三角主对角线不为0的话的行列式不为0，而且对角线上的元素不能是偶数，
				// 所以，你懂得
			    function create() {
			        var arr = [],
			        	k = 0;
			        for (var i = 0; i < 3; i++) {
			            var temp = [];
			            for (var j = 0; j < 3; j++) {
			                if (j <= i) {
			                	do{
    								k = parseInt(Math.random() * 9 + 1);
			                	}while(k % 2 === 0);
			                    temp.push(k);
			                } else {
			                    temp.push(0)
			                }
			            }
			            arr.push(temp);
			        }
			        return arr;
			    }

			    // 利用一个公式来求逆矩阵,成功补全了这个矩阵
			    function _add(matrix) {
			        var temp = [];
			        for (var i = 0; i < 3; i++) {
			            var temp_hang = [];
			            for(var j = 0; j < 3; j++){
			            	temp_hang[j] = matrix[i][j]
			            }
			            for (var j = 0; j < 3; j++) {
			                if (j === i) {
			                    temp_hang.push(1);
			                } else {
			                    temp_hang.push(0);
			                }
			            }
			            temp.push(temp_hang);
			        }
			        return temp;
			    }
			    function show(matrix){
			    	for(var i = 0; i < matrix.length; i++){
			    		console.log(i + ':' + matrix[i].join(' , '));
			    	}
			    }
			    // 利用另一条公式生成逆矩阵，将下矩阵清0了，但是还有上面的没清
			    function create_inverse(matrix) {
			    	// 将矩阵化为上三角
			        for (var i = 0; i < 3; i++) {
			            for(var j = i + 1; j < 3; j++){
			        		var t = matrix[i][i],
			        			o = matrix[j][i];
			            	for(var k = 5; k >= 0; k--){
			            		matrix[j][k] = (matrix[j][k] * t - matrix[i][k] * o + 26 * 26)%26;
			            		// matrix[j][k] = matrix[j][k] * matrix[i][i] - matrix[i][k] * matrix[j][i];
			            	}
			            		// show(matrix);
			            }
			        }
			        // 将矩阵化为对角矩阵
			        for (var i = 2; i >= 0; i--) {
			            for(var j = i - 1; j >= 0; j--){
			            	var t = matrix[i][i],
			        			o = matrix[j][i];
			            	for(var k = 0; k <= 5; k++){
			            		matrix[j][k] = (matrix[j][k] * t - matrix[i][k] * o + 26 * 26)%26;
			            	}
			            	// show(matrix);
			            }
			        }
			        debugger;
			        show(matrix);
			        // 将对角矩阵化为单位矩阵
			        for (var i = 0; i <= 2; i++) {
			            if(matrix[i][i] !== 1){
			            	var t = 0;
			            	for(var j = 1; j < 1000; j++){
								var k = (matrix[i][i] * j - 1 + 26)/ 26;
								if(k === Math.round(k)){
									break;
								}
							}
							debugger;
							t = j;
			            	for(var k = 0; k <= 5; k++){
			            		matrix[i][k]  = (matrix[i][k] * t + 26 * 26)%26;
			            	}

			            }
			            show(matrix);
			        }

			        // 取出单位矩阵的那一部分
			        for(var i = 0; i < 3; i++){
			        	matrix[i].splice(0,3);
			        }
			        show(matrix);

			        return matrix;
			    }
			    en_matrix = create();
			    show(en_matrix);
				de_matrix = create_inverse(_add(en_matrix));

				this.en_matrix = en_matrix;
				this.de_matrix = de_matrix;
				console.log(en_matrix.join('     '));
				
				console.log(de_matrix.join('     '));


			    // 初始化矩阵之后
				a = a.toLocaleUpperCase();
				temp = [];
				// 对于字符串先去掉原本的空格，还有一个操作就是两个字母加空格，在重复的字母里面插入一个填充字符Z
				a = a.replace(/\s+/g,'');
				// 将字符串3个为一组
				for(i = 0, length = a.length; i * 3 < length; i++){
					temp.push(a.slice(i * 3,( i + 1 )*3));
				}
				// 如果最后一个组合的不是3个字母
				if(temp[temp.length - 1].length === 1){
					temp[temp.length - 1] += 'Z'; // 填充z
				}
				if(temp[temp.length - 1].length === 2){
					temp[temp.length - 1] += 'Z'; // 填充z
				}
				console.log(temp);
				
				// 填充完了之后开始矩阵变换。
				for(i = 0, length = temp.length; i < length; i++){
					var num_temp = [],
						char_temp = temp[i];
					// 将分组的字母在数组中的位置放进num_temp中。
					num_temp.push([_this.interpreter.indexOf(char_temp[0])]);
					num_temp.push([_this.interpreter.indexOf(char_temp[1])]);
					num_temp.push([_this.interpreter.indexOf(char_temp[2])]);

					// 函数，矩阵相乘，返回结果(结果已经被26除)
					temp[i] = _this._matrix_mul(this.en_matrix, num_temp);

					// 转化对应的数字为字母。
					temp[i] = _this._inter.call(_this, temp[i]);
				}
					
			}
			renderDOM(3, this.prefix, temp, 'en');
			sele(3, 'decrypt').addEventListener('click', function(event){
            	_this.de_handle.call( _this, event, temp);
            });
    	});
    });
})();
