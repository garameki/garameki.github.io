�V�F�[�_�[�̃f�[�^�Z�b�g

���g�p�菇
��myFBOs�ւ̓o�^
�t�@�C���̒���sNameShader�ɓ����Ă��閼�O�œo�^����܂��B
�Q�ƕ��@��myFBOs.���O�ł��B�ȉ�myFBOs[sNameShader]�Ƃ��܂��B

��myFBOs[sNameShader]�̏�����
myFBOs[sNameShader].initialize(gl,width,height)�ōs���܂��B������context���擾���Aviewport�̑傫�������߂܂��B
���̏������͎g�p����graphic context���擾�ł������_�ōs���܂��B

��myFBOs[sNameShader]�̋N��
myFBOs[sNameShader].activate();
�܂���
myFBOs[sNameShader].activate("C[NTR]D[NTR]S[NTR]");//�_�u���N�I�[�e�[�V�������͐��K�\��
�ŃI�t���C���`�惂�[�h�ɂȂ�܂��B

��myFBOs[sNameShader]�̒�~
myFBOs[sNameShader].inactivate();
�Œ�~���A�ʏ�̕`�惂�[�h�ɂȂ�܂��B

���ݒ�
��sModeOfFBO�ɂ���
�����ݒ肪�f�t�H���g�ƂȂ�A.activate()�̂Ƃ��ɔ��f����܂��B
����.activate("C[NTR]D[NTR]S[NTR]")�ŁA�f�t�H���g�Ƃ͕ʂ̃��[�h�𔽉f�ł��܂��B
�ECN---�J���[�o�b�t�@�ɂ��Ă͉������܂���B�S�Ă̐F�ƃA���t�@�Ƀ}�X�N���|�����Ă��܂��܂��B
�ECT---�J���[�o�b�t�@�̃����_�����O���e�N�X�`���ɍs���܂��BmyFBOs[sNameShader].textureColorBuffer�Ŏ��o�����Ƃ��ł��܂��B
�ECR---�J���[�o�b�t�@��render buffer�ň����܂��B
�EDN---�f�v�X�o�b�t�@�ɂ��Ă͉������܂���B�f�v�X�e�X�g���s���܂���B
�EDT---�f�v�X�o�b�t�@�̃����_�����O���e�N�X�`���[�ɍs���܂��B�t�H�[�}�b�g��DEPTH24_STENCIL8�ł��BmyFBOs[sNameShader].textureDepthBuffer�Ŏ��o�����Ƃ��ł��܂��B
�EDR---�f�v�X�o�b�t�@�̃����_�����O��render buffer�ōs���܂��B
�ESN---�X�e���V���o�b�t�@�ɂ��Ă͉������܂���B�X�e���V���e�X�g��disable�ł��B
�EST---�X�e���V���o�b�t�@�̃����_�����O���e�N�X�`���ɍs���܂��B�t�H�[�}�b�g��DEPTH24_STENCIL8�ł��BmyFBOs[sNameShader].textureStencilBuffer�Ŏ��o�����Ƃ��ł��܂��B
�ESR---�X�e���V���o�b�t�@�̃����_�����O��render buffer�ōs���܂��B

��colorBufferModeOfFBO�ɂ���
�J���[�o�b�t�@�̃t�H�[�}�b�g��ς��܂��B
���ݎg����͈̂ȉ��ł��B
�Enone
�EcolorBufferModeIsRGBA4444
�EcolorBufferModeIsRGBA5551
�EcolorBufferModeIsALPHA
�EcolorBufferModeIsR8ForStencil
������myFBOs�̃v���p�e�B�[�Ƃ��ēo�^����Ă��܂��B

��controllBlendColorDepthStencilOfFBO�ɂ���
�u�����h�A�f�v�X�A�X�e���V���A�J���[�ɂ��ẴV�F�[�_�[�̓����o�^���Ă����܂��B
.active()��.active("C[NTR]D[NTR]S[NTR]")�̐ݒ��Ɏ��s����܂��B
���̕����͖ړI�ɍ��킹�āAShader��FBO�o���ɐ[���֘A���Ă���A�e�X�g�̏ꍇ�ɂ��ύX��p�ɂɍs���܂��̂ŁA
myShader,myFBOs�Ȃǂ̂悤�ɓƗ������Ă������̂ł����A�Ƃ肠�����AmyFBOs[sNameShader]�Ɏ�荞�܂�A.activate();�̍Ō�Ɏ��s����Ă��܂��B

