package com.janilla.cms;

import java.util.ArrayList;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;

import com.janilla.web.ApplicationHandlerBuilder;
import com.janilla.web.ResourceHandlerFactory;
import com.janilla.web.WebHandlerFactory;

public class CustomApplicationHandlerBuilder extends ApplicationHandlerBuilder {

	@Override
	protected Stream<WebHandlerFactory> buildFactories() {
		var ff = super.buildFactories().collect(Collectors.toCollection(ArrayList::new));
		var i = IntStream.range(0, ff.size()).filter(x -> ff.get(x) instanceof ResourceHandlerFactory).findFirst()
				.getAsInt();
		ff.add(i, factory.create(FooHandlerFactory.class));
		return ff.stream();
	}
}
