//
//  GLSaver.h
//  Flurry
//
//  Created by Satish on 5/5/15.
//  Copyright (c) 2015 Satish Maha Software. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <OpenGLES/ES2/glext.h>
#import <GLKit/GLKit.h>

#import "Buffers.h"

@class Uniforms;

@interface Renderer : NSObject

{
    @public
    GLint drawingRectId;
}

- (instancetype)initWithProgram:(GLuint)program;

- (void)bindAttributes;
- (void)setup;
- (void)renderScene;

@property (nonatomic, strong) Buffers *buffers;
@property (nonatomic, assign) GLuint glTexture;


@end
