//
//  GameViewController.m
//  Flurry
//
//  Created by Satish on 5/1/15.
//  Copyright (c) 2015 Satish Maha Software. All rights reserved.
//

#import "GameViewController.h"

#import "FlurrySmoke.h"
#import "Renderer.h"
#import "Star.h"
#import "Spark.h"
#import "State.h"

#define BUFFER_OFFSET(i) ((void*)(i))

// Uniform index.
enum
{
    UNIFORM_MODELVIEWPROJECTION_MATRIX,
    UNIFORM_NORMAL_MATRIX,
    NUM_UNIFORMS
};
GLint uniforms[NUM_UNIFORMS];

// Attribute index.
enum
{
    ATTRIB_VERTEX,
    ATTRIB_NORMAL,
    NUM_ATTRIBUTES
};

@interface GameViewController ()
{
    GLuint _program;
    
    GLKMatrix4 _modelViewProjectionMatrix;
    GLKMatrix3 _normalMatrix;
    GLKMatrix4 _modelViewMatrix;
    
    float _rotation;
    
    GLuint _vertexArray;
    GLuint _vertexBuffer;

}

@property (strong, nonatomic) EAGLContext *context;
//@property (nonatomic, strong) FlurryPreset *myClassicPreset;
@property (nonatomic, strong) Renderer *renderer;
@property (nonatomic, assign) NSTimeInterval timeCounter;
@property (nonatomic, strong) GLKBaseEffect *effect;

@end

@implementation GameViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    self.context = [[EAGLContext alloc] initWithAPI:kEAGLRenderingAPIOpenGLES2];
    
    if (!self.context) {
        NSLog(@"Failed to create ES context");
    }
    
    GLKView *view = (GLKView *)self.view;
    view.context = self.context;
    view.drawableDepthFormat = GLKViewDrawableDepthFormat24;
    self.preferredFramesPerSecond = 60;
    
    [self setupGL];
}

- (BOOL)shouldAutorotate
{
    return NO;
}

- (void)setupGL
{
    [EAGLContext setCurrentContext:self.context];
    
    [self loadShaders];
    
    State *state = [State sharedState];
    state.screenWidth = self.view.frame.size.width;
    state.screenHeight = self.view.frame.size.height;

    Renderer *renderer = [[Renderer alloc] initWithProgram:_program];
    [renderer bindAttributes];
    [self setRenderer:renderer];
    
    glUseProgram(_program);
    
    GLKMatrix4 projectionMatrix = GLKMatrix4MakeOrtho(0, self.view.bounds.size.width, 0, self.view.bounds.size.height, -1, 1);
    GLKMatrix4 identityMatrix = GLKMatrix4Identity;
    
    glUniformMatrix4fv(uniforms[UNIFORM_MODELVIEWPROJECTION_MATRIX], 1, 0, projectionMatrix.m);
    glUniformMatrix4fv(uniforms[UNIFORM_NORMAL_MATRIX], 1, 0, identityMatrix.m);

    glDisable(GL_DEPTH_TEST);
    glDisable(GL_CULL_FACE);
    glEnable(GL_BLEND);
    
    if (self.timeCounter == 0)
    {
        self.timeCounter = [[NSDate date] timeIntervalSince1970];
    }
    
    state.numOfStreams = 5;
    state.currentColorMode = tiedyeColorMode;
    [state setRandSeed:[self randomFloatBetween:0.0f and:300.0f]];
        
    //Also creates texture
    [[self renderer] setup];
    
    FlurrySmoke *smoke = [[FlurrySmoke alloc] initWithBuffers:[self renderer].buffers];
    [state setSmoke:smoke];
    
    Star *star = [Star new];
    [state setStar:star];
    
    for (NSInteger i = 0; i < 32; i++)
    {
        Spark *spark = [[Spark alloc] initWithSparkAmount:i];
        state->spark[i] = spark;
    }
    
    for (NSInteger i = 0; i < NUMSMOKEPARTICLES / 4; i++)
    {
        for (NSInteger k = 0; k < 4; k++)
        {
            state.smoke->particles[i].dead.i[k] = 1;
        }
    }
    
    for (NSInteger i = 0; i < 12; i++)
    {
        Spark *stateSpark = state->spark[i];
        [stateSpark updateSpark];
    }
    
    state.oldTime = [self timeSinceStart] + [state randSeed];
}

- (NSTimeInterval)timeSinceStart
{
    NSTimeInterval interval = ([[NSDate date] timeIntervalSince1970] - self.timeCounter);
    return interval;
}

- (void)update
{
    State *state = [State sharedState];
    
    state.frame++;
    state.oldTime   = state.time;
    state.time      = [self timeSinceStart] + state.randSeed;
    state.deltaTime = state.time - state.oldTime;
    state.drag      = pow(0.9965, state.deltaTime * 85);
    
    [state.star updateStar];
    
    NSInteger numberOfStreams = 5;
    for (NSInteger i = 0; i < numberOfStreams; i++)
    {
        [state->spark[i] updateSpark];
    }
    
    [state.smoke updateSmoke];
    [state.smoke drawSmoke];
}

- (void)glkView:(GLKView *)view drawInRect:(CGRect)rect
{
    glClearColor(0, 0, 0, 1.0f);
//    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    [self.renderer renderScene];
}


- (float)randomFloatBetween:(float)smallNumber and:(float)bigNumber
{
    float diff = bigNumber - smallNumber;
    return (((float) (arc4random() % ((unsigned)RAND_MAX + 1)) / RAND_MAX) * diff) + smallNumber;
}

- (BOOL)loadShaders
{
    GLuint vertShader, fragShader;
    NSString *vertShaderPathname, *fragShaderPathname;
    
    // Create shader program.
    _program = glCreateProgram();
    
    // Create and compile vertex shader.
    vertShaderPathname = [[NSBundle mainBundle] pathForResource:@"Shader" ofType:@"vsh"];
    if (![self compileShader:&vertShader type:GL_VERTEX_SHADER file:vertShaderPathname]) {
        NSLog(@"Failed to compile vertex shader");
        return NO;
    }
    
    // Create and compile fragment shader.
    fragShaderPathname = [[NSBundle mainBundle] pathForResource:@"Shader" ofType:@"fsh"];
    if (![self compileShader:&fragShader type:GL_FRAGMENT_SHADER file:fragShaderPathname]) {
        NSLog(@"Failed to compile fragment shader");
        return NO;
    }
    
    // Attach vertex shader to program.
    glAttachShader(_program, vertShader);
    
    // Attach fragment shader to program.
    glAttachShader(_program, fragShader);
    
    // Bind attribute locations.
    // This needs to be done prior to linking.
    glBindAttribLocation(_program, GLKVertexAttribPosition, "position");
    glBindAttribLocation(_program, GLKVertexAttribColor, "color");
    glBindAttribLocation(_program, GLKVertexAttribNormal, "uv");
    
    // Link program.
    if (![self linkProgram:_program]) {
        NSLog(@"Failed to link program: %d", _program);
        
        if (vertShader) {
            glDeleteShader(vertShader);
            vertShader = 0;
        }
        if (fragShader) {
            glDeleteShader(fragShader);
            fragShader = 0;
        }
        if (_program) {
            glDeleteProgram(_program);
            _program = 0;
        }
        
        return NO;
    }
    
    // Get uniform locations.
    uniforms[UNIFORM_MODELVIEWPROJECTION_MATRIX] = glGetUniformLocation(_program, "projectionMatrix");
    uniforms[UNIFORM_NORMAL_MATRIX] = glGetUniformLocation(_program, "modelViewMatrix");

    // Release vertex and fragment shaders.
    if (vertShader) {
        glDetachShader(_program, vertShader);
        glDeleteShader(vertShader);
    }
    if (fragShader) {
        glDetachShader(_program, fragShader);
        glDeleteShader(fragShader);
    }
    
    return YES;
}


- (BOOL)compileShader:(GLuint *)shader type:(GLenum)type file:(NSString *)file
{
    GLint status;
    const GLchar *source;
    
    source = (GLchar *)[[NSString stringWithContentsOfFile:file encoding:NSUTF8StringEncoding error:nil] UTF8String];
    if (!source) {
        NSLog(@"Failed to load vertex shader");
        return NO;
    }
    
    *shader = glCreateShader(type);
    glShaderSource(*shader, 1, &source, NULL);
    glCompileShader(*shader);
    
#if defined(DEBUG)
    GLint logLength;
    glGetShaderiv(*shader, GL_INFO_LOG_LENGTH, &logLength);
    if (logLength > 0) {
        GLchar *log = (GLchar *)malloc(logLength);
        glGetShaderInfoLog(*shader, logLength, &logLength, log);
        NSLog(@"Shader compile log:\n%s", log);
        free(log);
    }
#endif
    
    glGetShaderiv(*shader, GL_COMPILE_STATUS, &status);
    if (status == 0) {
        glDeleteShader(*shader);
        return NO;
    }
    
    return YES;
}

- (BOOL)linkProgram:(GLuint)prog
{
    GLint status;
    glLinkProgram(prog);
    
#if defined(DEBUG)
    GLint logLength;
    glGetProgramiv(prog, GL_INFO_LOG_LENGTH, &logLength);
    if (logLength > 0) {
        GLchar *log = (GLchar *)malloc(logLength);
        glGetProgramInfoLog(prog, logLength, &logLength, log);
        NSLog(@"Program link log:\n%s", log);
        free(log);
    }
#endif
    
    glGetProgramiv(prog, GL_LINK_STATUS, &status);
    if (status == 0) {
        return NO;
    }
    
    return YES;
}

- (BOOL)validateProgram:(GLuint)prog
{
    GLint logLength, status;
    
    glValidateProgram(prog);
    glGetProgramiv(prog, GL_INFO_LOG_LENGTH, &logLength);
    if (logLength > 0) {
        GLchar *log = (GLchar *)malloc(logLength);
        glGetProgramInfoLog(prog, logLength, &logLength, log);
        NSLog(@"Program validate log:\n%s", log);
        free(log);
    }
    
    glGetProgramiv(prog, GL_VALIDATE_STATUS, &status);
    if (status == 0) {
        return NO;
    }
    
    return YES;
}

@end
