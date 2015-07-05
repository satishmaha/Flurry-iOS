//
//  Texture.h
//  Flurry
//
//  Created by Satish on 5/7/15.
//  Copyright (c) 2015 Satish Maha Software. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <OpenGLES/ES2/glext.h>

@interface Texture : NSObject
{
    @public
    GLuint glTexture[1];
}

- (void)makeTexture;

@end
