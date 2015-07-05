//
//  GLSaver.m
//  Flurry
//
//  Created by Satish on 5/5/15.
//  Copyright (c) 2015 Satish Maha Software. All rights reserved.
//

#import "Renderer.h"

#import "State.h"
#import "Texture.h"

#define BUFFER_OFFSET(i) ((void*)(i))


struct Rectangle
{
    float position[8];
    float color[16];
};

@interface Attributes : NSObject
{
    @public
    GLint positionAttributes;
    GLint colorAttributes;
    GLint uvAttributes;
}

@end

@implementation Attributes
//
@end

@interface Renderer ()

{
    struct Rectangle rect;
    GLuint positionBuffer;
    GLuint colorBuffer;
    GLuint indexBuffer;
    GLuint uvBuffer;
    GLuint positionVertexArray;
}

@property (nonatomic, strong) Attributes *attributes;
@property (nonatomic, assign) GLuint program;
@property (nonatomic, strong) Texture *texture;

@end

@implementation Renderer

- (instancetype)initWithProgram:(GLuint)program
{
    self = [super init];
    if (self)
    {
        _program = program;
        _attributes = [Attributes new];
        _buffers = [Buffers new];
        
        glGenVertexArraysOES(1, &self->positionVertexArray);
        glBindVertexArrayOES(self->positionVertexArray);
        glGenBuffers(1, &self->positionBuffer);
        glGenBuffers(1, &self->colorBuffer);
        glGenBuffers(1, &self->indexBuffer);
        glGenBuffers(1, &self->uvBuffer);
        
        //    this.rect.position.set([width, height, 0, height, width, 0, 0, 0]);
        
        State *state = [State sharedState];
        
        self->rect.position[0] = state.screenWidth;
        self->rect.position[1] = state.screenHeight;
        self->rect.position[2] = 0;
        self->rect.position[3] = state.screenHeight;
        self->rect.position[4] = state.screenWidth;
        self->rect.position[5] = 0;
        self->rect.position[6] = 0;
        self->rect.position[7] = 0;
     
        for (int i = 0; i < 4; i++)
        {
            self->rect.color[i*4 + 3] = 0.1f;
        }
    }
    
    return self;
}

- (void)bindAttributes
{
    self->drawingRectId = glGetUniformLocation(self.program, "drawingRect");
    
//    rect	CGRect	(origin = (x = 0, y = 0), size = (width = 414, height = 736))
    

    self.attributes->positionAttributes = glGetAttribLocation(self.program, "position");
    self.attributes->colorAttributes = glGetAttribLocation(self.program, "color");
    self.attributes->uvAttributes = glGetAttribLocation(self.program, "uv");
}

- (void)setup
{
    Texture *texture = [Texture new];
    [self setTexture:texture];
    [texture makeTexture];
}


- (void)renderScene
{
    /*
    gl.blendEquation(GLES.FUNC_ADD);
    gl.blendFunc(GLES.SRC_ALPHA, GLES.ONE_MINUS_SRC_ALPHA);
    gl.uniform1i(this.uniforms.drawingRect.id, 1);
    gl.bindTexture(GLES.TEXTURE_2D, null);
    gl.bindBuffer(GLES.ARRAY_BUFFER, this.buffers.position.buffer);
    gl.bufferData(GLES.ARRAY_BUFFER, this.rect.position, GLES.STATIC_DRAW);
    gl.vertexAttribPointer(this.attributes.position, 2, GLES.FLOAT, false, 0, 0);
    
    gl.bindBuffer(GLES.ARRAY_BUFFER, this.buffers.color.buffer);
    gl.bufferData(GLES.ARRAY_BUFFER, this.rect.color, GLES.STATIC_DRAW);
    gl.vertexAttribPointer(this.attributes.color, 4, GLES.FLOAT, false, 0, 0);
    gl.drawArrays(GLES.TRIANGLE_STRIP, 0, 4); // Causes a warning on first call due to unbound UV data
     */
    
//    Fade rect
    glBlendEquation(GL_FUNC_ADD);
    glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);
    glUniform1i(self->drawingRectId, 1);
    glBindTexture(GL_TEXTURE_2D, 0);
    glBindBuffer(GL_ARRAY_BUFFER, self->positionBuffer);
    glBufferData(GL_ARRAY_BUFFER, sizeof(self->rect.position), self->rect.position, GL_STATIC_DRAW);
    glEnableVertexAttribArray(GLKVertexAttribPosition);
    glVertexAttribPointer(GLKVertexAttribPosition, 2, GL_FLOAT, GL_FALSE, 0, BUFFER_OFFSET(0));

    glBindBuffer(GL_ARRAY_BUFFER, self->colorBuffer);
    glBufferData(GL_ARRAY_BUFFER, sizeof(self->rect.color), self->rect.color, GL_STATIC_DRAW);
    glEnableVertexAttribArray(GLKVertexAttribColor);
    glVertexAttribPointer(GLKVertexAttribColor, 4, GL_FLOAT, GL_FALSE, 0, 0);

    // Causes a warning on first call due to unbound UV data
    glDrawArrays(GL_TRIANGLE_STRIP, 0, 4);
    
    glBlendEquation(GL_FUNC_ADD);
    glBlendFunc(GL_ONE, GL_ONE);
    glUniform1i(self->drawingRectId, 0);
    glBindTexture(GL_TEXTURE_2D, self.texture->glTexture[0]);
    
    glBindBuffer(GL_ARRAY_BUFFER, self->positionBuffer);
    glBufferData(GL_ARRAY_BUFFER, sizeof(self.buffers->positionData), self.buffers->positionData, GL_DYNAMIC_DRAW);
    glEnableVertexAttribArray(GLKVertexAttribPosition);
    glVertexAttribPointer(GLKVertexAttribPosition, 2, GL_FLOAT, GL_FALSE, 0, BUFFER_OFFSET(0));
    
    glBindBuffer(GL_ARRAY_BUFFER, self->colorBuffer);
    glBufferData(GL_ARRAY_BUFFER, sizeof(self.buffers->colorData), self.buffers->colorData, GL_DYNAMIC_DRAW);
    glEnableVertexAttribArray(GLKVertexAttribColor);
    glVertexAttribPointer(GLKVertexAttribColor, 4, GL_FLOAT, GL_FALSE, 0, BUFFER_OFFSET(0));

    glBindBuffer(GL_ARRAY_BUFFER, self->uvBuffer);
    glBufferData(GL_ARRAY_BUFFER, sizeof(self.buffers->uvData), self.buffers->uvData, GL_DYNAMIC_DRAW);
    glEnableVertexAttribArray(GLKVertexAttribNormal);
    glVertexAttribPointer(GLKVertexAttribNormal, 2, GL_FLOAT, GL_FALSE, 0, BUFFER_OFFSET(0));
    
    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, self->indexBuffer);
    glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(self.buffers->indexData), self.buffers->indexData, GL_DYNAMIC_DRAW);
    glDrawElements(GL_TRIANGLES, NUMSMOKEPARTICLES * 6, GL_UNSIGNED_SHORT, 0);
}

@end
